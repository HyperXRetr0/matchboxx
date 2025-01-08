import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies["auth_token"];
    if (!token) {
      console.log("Authorization token not found in cookies.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error("Invalid JWT environment variable.");
    }
    const decoded = jwt.verify(token, jwt_secret);
    if (!decoded) {
      console.log("Invalid authorization token.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    req.userId = (decoded as jwt.JwtPayload).userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
}
