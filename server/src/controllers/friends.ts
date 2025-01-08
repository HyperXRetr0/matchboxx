import { Request, Response } from "express";
import client from "../PrismaClient/client";

export async function getAllFriends(req: Request, res: Response) {
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
    const friends = await client.friend.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        friend: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      data: friends,
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

export async function deleteFriend(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const { id } = req.params;
    if (!id) {
      console.log("Invalid user id.");
      res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
      return;
    }
    const friend = await client.friend.findFirst({
      where: {
        id,
      },
    });
    if (!friend) {
      console.log("You are not friends with each other.");
      res.status(400).json({
        success: false,
        message: "You are not friends with each other.",
      });
      return;
    }
    await client.friend.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      success: true,
      message: "Successfully removed user from friendlist.",
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
