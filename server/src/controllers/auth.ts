import { Request, Response } from "express";
import client from "../PrismaClient/client";
import { User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName }: Omit<User, "id"> = req.body;
    const user: User | null = await client.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      console.log("Email already in use.");
      res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
      return;
    }
    const saltRounds = process.env.SALT;
    if (!saltRounds || isNaN(Number(saltRounds))) {
      throw new Error("Invalid SALT environment variable.");
    }
    const salt = await bcryptjs.genSalt(Number(saltRounds));
    const hash = await bcryptjs.hash(password, salt);
    await client.user.create({
      data: {
        email,
        password: hash,
        firstName,
        lastName,
      },
    });
    console.log("User created successfully.");
    res.status(201).json({
      success: true,
      message: "User sign up successful",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const { email, password }: Pick<User, "email" | "password"> = req.body;
    let user: User | null = await client.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      console.log("Invalid Credentials.");
      res.status(401).json({
        sucess: false,
        message: "Invalid Credentials.",
      });
      return;
    }
    const verify = await bcryptjs.compare(password, user.password);
    if (!verify) {
      console.log("Invalid Credentials.");
      res.status(401).json({
        sucess: false,
        message: "Invalid Credentials.",
      });
      return;
    }
    const jwt_secret = process.env.JWT_SECRET;
    console.log(jwt_secret);
    if (!jwt_secret) {
      throw new Error("Invalid JWT SECRET environment variable.");
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      jwt_secret
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.production === "production",
    });
    res.status(200).json({
      success: true,
      message: "User sign in successful.",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authroized.",
      });
      return;
    }
    const user = await client.user.findFirst({
      where: {
        id,
      },
    });
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
