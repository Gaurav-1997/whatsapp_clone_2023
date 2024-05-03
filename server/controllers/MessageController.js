import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import { pusherServer } from "../utils/PusherServer.js";
import { MessageDeliveryStatus, MessageType } from "@prisma/client";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { senderId, recieverId, message, type, privateChatId } = req.body;

    const isReceiverOnline = onlineUsers.get(recieverId);
    console.log("req.body: ", req.body);
    const currentChatUser = global.currentChatUserIdMap.get(senderId);
    console.log(global.currentChatUserIdMap);
    console.log("currentChatUserId: ", currentChatUser, "==", recieverId);
    console.log(
      "currentChatUserId: ",
      isReceiverOnline && currentChatUser === recieverId
    );

    if (message && senderId) {
      const newMessage = await prisma.messages.create({
        data: {
          sender: { connect: { id: parseInt(senderId) } },
          content: message,
          type: MessageType.TEXT,
          messageStatus:
            isReceiverOnline && currentChatUser === recieverId
              ? MessageDeliveryStatus.READ
              : MessageDeliveryStatus.SENT,
          chatId: privateChatId,
        },
        select: {
          id: true,
          senderId: true,
          content: true,
          type: true,
          messageStatus: true,
          chatId: true,
          sent_at: true,
        },
      });

      await prisma.chat.update({
        where: { chat_id: privateChatId },
        data: {
          last_message: message,
          last_message_sender_id: senderId,
        },
      });

      console.log("newMessage", newMessage);
      /* trigger a pusher event for a specific chat for new message*/
      console.log("global.onlineUsers", global.onlineUsers);

      // Check if the receiver is online and reciever is currenthatUser==recieverId then make message read
      // it also acts is pusher-channel
      if (isReceiverOnline && currentChatUser === recieverId) {
        newMessage.messageStatus = MessageDeliveryStatus.READ;

        pusherServer.trigger(isReceiverOnline, "message:sent", {
          message: newMessage,
        });
      } else if (isReceiverOnline) {
        newMessage.messageStatus = MessageDeliveryStatus.SENT;

        pusherServer.trigger(isReceiverOnline, "message:sent", {
          message: newMessage,
        });
      }
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
    const { privateChatId, senderId, recieverId } = req.params;

    global.currentChatUserIdMap.set(parseInt(senderId), parseInt(recieverId));

    console.log("privateChatId", privateChatId);

    const messages = await prisma.messages.findMany({
      where: { chatId: privateChatId },
      orderBy: { sent_at: "asc" },
    });

    const unreadMessages = [];

    messages.forEach((message, idx) => {
      if (
        message.messageStatus !== MessageDeliveryStatus.READ &&
        message.senderId === parseInt(recieverId)
      ) {
        messages[idx].messageStatus = MessageDeliveryStatus.READ;
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: { id: { in: unreadMessages } },
      data: { messageStatus: MessageDeliveryStatus.READ },
    });

    const lastMessage = await prisma.chat.findUnique({
      where: { chat_id: privateChatId },
      select: {
        last_message: true,
        last_message_sender_id: true,
      },
    });
    res.status(200).json({ messages: messages, lastMessage });
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
