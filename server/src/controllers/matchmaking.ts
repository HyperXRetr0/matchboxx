import { Request, Response } from "express";
import client from "../PrismaClient/client";
import { clients, hasIntersection } from "../utils/utils";
import { getUserSkills } from "./users";
import { Skill, User } from "@prisma/client";

type ModifiedUser = User & {
  skillsProficient: Skill[];
  skillsToLearn: Skill[];
};

export async function startMatchmaking(req: Request, res: Response) {
  try {
    const id: string | undefined = req.userId;
    if (!id) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const currentUser: ModifiedUser | null = await client.user.findUnique({
      where: { id },
      include: {
        skillsProficient: true,
        skillsToLearn: true,
      },
    });
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const otherUsers = await Promise.all(
      Array.from(clients).map(
        async ([key, val]) =>
          await client.user.findFirst({
            where: {
              id: key,
              NOT: {
                id,
              },
            },
            include: {
              skillsProficient: true,
              skillsToLearn: true,
            },
          })
      )
    ).then((results) => results.filter((user): user is ModifiedUser => !!user));
    if (!otherUsers.length) {
      res.status(404).json({
        success: false,
        message: "No other users found",
      });
      return;
    }

    const matchedUserIds = otherUsers.reduce<string[]>((acc, user) => {
      const userId = user.id;
      const userProficientSkills = user.skillsProficient.map(
        (skill) => skill.id
      );
      const userSkillsToLearn = user.skillsToLearn.map((skill) => skill.id);
      const learnSkillsMatch = hasIntersection(
        currentUser.skillsToLearn.map((s) => s.id),
        userProficientSkills
      );
      const proficientSkillsMatch = hasIntersection(
        currentUser.skillsProficient.map((s) => s.id),
        userSkillsToLearn
      );
      if (learnSkillsMatch || proficientSkillsMatch) {
        acc.push(userId);
      }
      return acc;
    }, []);
    res.status(200).json({
      success: true,
      data: matchedUserIds,
    });
    return;
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
}
