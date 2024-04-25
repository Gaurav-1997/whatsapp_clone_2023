import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import { pusherServer } from "../utils/PusherServer.js";
import { MessageDeliveryStatus, MessageType } from "@prisma/client";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    // const { senderId, message, type, chatId } = req.body;

    // The message to send.
    const message = req.body.message;

    // The ID of the sender.
    const from = parseInt(req.body.senderId);

    // The ID of the receiver.
    const messageType = req.body.type;
    const privateChatId = req.body.chatId;

    const to = 122257;
    // Check if the receiver is online.
    const isReceiverOnline = onlineUsers.get(to);
    console.log("req.body: ", req.body);

    if (message && from) {
      // console.log("got message", message, from, to);
      const newMessage = await prisma.messages.create({
        data: {
          sender: { connect: { id: parseInt(from) } },
          content: message,
          type: MessageType.TEXT,
          messageStatus: isReceiverOnline
            ? MessageDeliveryStatus.READ
            : MessageDeliveryStatus.SENT,
          chat: { connect: { chat_id: privateChatId } },
        },
        select: {
          sender: true,
          content: true,
          type: true,
          messageStatus: true,
          chatId: true,
        },
      });

      console.log("newMessage", newMessage);
      /* trigger a pusher event for a specific chat for new message*/
      const chatId = global.onlineUsers.get(to);
      console.log("global.onlineUsers", global.onlineUsers);
      console.log("chatId", chatId);
      await pusherServer.trigger(chatId, "message:sent", {
        message: newMessage,
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).json({ message: "SenderId is required." });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    // console.log("from getMessages", req.params);
    const prisma = getPrismaInstance();
    const { from, to } = req.params;

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            recieverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            recieverId: parseInt(from),
          },
        ],
      },
      orderBy: { id: "asc" },
    });

    const unreadMessages = [];

    messages.forEach((message, idx) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[idx].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: { id: { in: unreadMessages } },
      data: { messageStatus: "read" },
    });

    res.status(200).json({ messages: messages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      const filePathName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, filePathName);

      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: filePathName,
            senderId: parseInt(from),
            recieverId: parseInt(to),
            type: "image",
          },
        });

        // Check if the receiver is online.
        const chatId = onlineUsers.get(to);
        if (chatId) {
          //means user is online and logged in
          await pusherServer.trigger(`channel:${chatId}`, "message:sent", {
            message,
          });
        }
        return res.status(201).json({ message });
      }
      return res.status(400).send("From & to is required");
    }
    return res.status(400).send("Image is required");
  } catch (error) {
    next(error);
  }
};
