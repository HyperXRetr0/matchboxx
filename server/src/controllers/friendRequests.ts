import { Request, Response } from "express";
import client from "../PrismaClient/client";

export async function sendFriendRequest(req: Request, res: Response) {
  try {
    const senderId = req.userId;
    if (!senderId) {
      console.log("User not authorized.");
      res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
      return;
    }
    const { id: receiverId }: { id: string } = req.body;
    if (senderId === receiverId) {
      console.log("Self friend requests not allowed.");
      res.status(400).json({
        success: false,
        message: "Self friend requests not allowed.",
      });
      return;
    }
    const receiver = await client.user.findFirst({
      where: {
        id: receiverId,
      },
    });
    if (!receiver) {
      console.log("User not found with that id.");
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }
    const pending = await client.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId,
            senderId,
          },
          {
            receiverId: senderId,
            senderId: receiverId,
          },
        ],
      },
    });
    if (pending) {
      console.log("Pending friend request.");
      res.status(400).json({
        success: false,
        message: "Pending frined request.",
      });
      return;
    }
    await client.friendRequest.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
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

export async function getReceivedRequests(req: Request, res: Response) {
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
    const requests = await client.friendRequest.findMany({
      where: {
        receiverId: id,
      },
    });
    res.status(200).json({
      success: true,
      data: requests,
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

export async function getSentRequests(req: Request, res: Response) {
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
    const requests = await client.friendRequest.findMany({
      where: {
        senderId: id,
      },
    });
    res.status(200).json({
      success: true,
      data: requests,
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

export async function handleRequest(req: Request, res: Response) {
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
      response,
      friendRequestId,
    }: { response: "ACCEPT" | "REJECT"; friendRequestId: string } = req.body;
    if (!response || (response !== "ACCEPT" && response !== "REJECT")) {
      console.log("Invalid response");
      res.status(400).json({
        success: false,
        message: "Invalid Response.",
      });
      return;
    }
    const friendRequest = await client.friendRequest.findFirst({
      where: {
        id: friendRequestId,
      },
    });
    if (!friendRequest) {
      console.log("No friend request fount.");
      res.status(400).json({
        success: false,
        message: "No friend request.",
      });
      return;
    }
    if (response === "ACCEPT") {
      await client.friend.create({
        data: {
          user: {
            connect: { id },
          },
          friend: {
            connect: { id: friendRequest.senderId },
          },
        },
      });

      await client.friendRequest.delete({
        where: {
          id: friendRequest.id,
        },
      });
      console.log("Friend request accepted.");
      res.status(201).json({
        success: true,
        message: "Friend request accepted.",
      });
      return;
    }
    await client.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });
    console.log("Request removed.");
    res.status(200).json({
      success: true,
      message: "Request removed successfully.",
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
