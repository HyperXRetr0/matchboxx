import { Request, Response } from "express";
import client from "../PrismaClient/client";
import { User } from "@prisma/client";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await client.user.findMany({
      include: {
        skillsProficient: true,
        skillsToLearn: true,
      },
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      console.log("User id not found in url parameters.");
      res.status(400).json({
        success: false,
        message: "User id not found.",
      });
      return;
    }
    const user = await client.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      console.log("User not found.");
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: user,
    });
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

export async function updateUserSkills(req: Request, res: Response) {
  try {
    const {
      skillsProficient,
      skillsToLearn,
    }: {
      skillsProficient?: string[];
      skillsToLearn?: string[];
    } = req.body;
    const id = req.userId;
    const user = await client.user.findFirst({
      where: {
        id,
      },
      include: {
        skillsProficient: true,
        skillsToLearn: true,
      },
    });
    if (!user) {
      console.log("User not found.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const data: {
      skillsProficient?: { connect: { id: string }[] };
      skillsToLearn?: { connect: { id: string }[] };
    } = {};
    if (skillsProficient && skillsProficient?.length > 0) {
      data.skillsProficient = {
        connect: skillsProficient.map((skillId) => ({ id: skillId })),
      };
    }
    if (skillsToLearn && skillsToLearn?.length > 0) {
      data.skillsToLearn = {
        connect: skillsToLearn.map((skillId) => ({ id: skillId })),
      };
    }
    if (Object.keys(data).length > 0) {
      await client.user.update({
        where: { id },
        data,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
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

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const userData: Partial<Pick<User, "email" | "firstName" | "lastName">> =
      req.body;
    await client.user.update({
      where: {
        id,
      },
      data: { ...userData },
    });
    res.status(201).json({
      success: true,
      message: "User updated successfully.",
    });
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

export async function getUserSkills(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const skills = await client.user.findFirst({
      where: { id },
      select: {
        skillsProficient: true,
        skillsToLearn: true,
      },
    });
    res.status(200).json({
      success: true,
      data: skills,
    });
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

export async function deleteUserSkill(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const {
      skillsProficientToRemove,
      skillsToLearnToRemove,
    }: {
      skillsProficientToRemove?: string[];
      skillsToLearnToRemove?: string[];
    } = req.body;
    if (!skillsProficientToRemove && !skillsToLearnToRemove) {
      console.log("No skill to delete.");
      res.status(400).json({
        success: false,
        message: "No skill to delete.",
      });
      return;
    }
    const data: {
      skillsProficient?: { disconnect: { id: string }[] };
      skillsToLearn?: { disconnect: { id: string }[] };
    } = {};
    if (skillsProficientToRemove && skillsProficientToRemove?.length > 0) {
      data.skillsProficient = {
        disconnect: skillsProficientToRemove.map((skillId) => ({
          id: skillId,
        })),
      };
    }
    if (skillsToLearnToRemove && skillsToLearnToRemove?.length > 0) {
      data.skillsToLearn = {
        disconnect: skillsToLearnToRemove.map((skillId) => ({ id: skillId })),
      };
    }
    if (Object.keys(data).length > 0) {
      await client.user.update({
        where: { id },
        data,
      });
    }
    res.status(200).json({
      success: true,
      message: "Skills deleted successfully.",
    });
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
