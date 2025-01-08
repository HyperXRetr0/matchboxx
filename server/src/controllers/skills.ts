import { Skill } from "@prisma/client";
import { Request, Response } from "express";
import client from "../PrismaClient/client";

export async function addSkill(req: Request, res: Response) {
  try {
    const { name: skillName }: Pick<Skill, "name"> = req.body;
    const skill = await client.skill.findFirst({
      where: {
        name: skillName,
      },
    });
    if (skill) {
      console.log("Skill already exists.");
      res.status(400).json({
        success: false,
        message: "Skill already exists.",
      });
      return;
    }
    await client.skill.create({
      data: {
        name: skillName,
      },
    });
    res.status(201).json({
      success: true,
      message: "Skill successfully created.",
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

export async function getAllSkills(req: Request, res: Response) {
  try {
    const skills = await client.skill.findMany({});
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

export async function searchSkill(req: Request, res: Response) {
  try {
    const { name: skillName }: Pick<Skill, "name"> = req.body;
    const skills = await client.skill.findMany({
      where: {
        name: {
          startsWith: skillName,
          mode: "insensitive",
        },
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
