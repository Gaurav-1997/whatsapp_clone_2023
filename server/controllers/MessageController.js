import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import { pusherServer } from "../utils/PusherServer.js";
import {
  MessageDeliveryStatus,
  MessageType,
  ReactionType,
} from "@prisma/client";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const {
      senderId,
      recieverId,
      message,
      type,
      privateChatId,
      parentMessageId = "",
      parentMessage = "",
      repliedBy = "",
    } = req.body;

    const isReceiverOnline = onlineUsers.get(recieverId);
    // sender should be currentChatUser for reciever to read the message
    const currentChatUser = global.currentChatUserIdMap.get(recieverId);

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
          parentMessageId: parentMessageId || null,
          parentMessageContent: parentMessage || null,
          repliedByUserId: repliedBy.toString() || null,
        },
        select: {
          id: true,
          senderId: true,
          content: true,
          type: true,
          messageStatus: true,
          chatId: true,
          sent_at: true,
          parentMessageId: true,
          parentMessageContent: true,
          repliedByUserId: true,
          reactions: true,
        },
      });

      const latest_chat = await prisma.chat.update({
        where: { chat_id: privateChatId },
        data: {
          last_message: message,
          last_message_sender_id: senderId,
          last_message_status:
            isReceiverOnline && currentChatUser === senderId
              ? MessageDeliveryStatus.READ
              : MessageDeliveryStatus.SENT,
          unread_message_count:
            isReceiverOnline && currentChatUser === senderId
              ? 0
              : { increment: 1 },
        },
        select: {
          unread_message_count: true,
        },
      });

      /* trigger a pusher event for a specific chat for new message
      
      #Check if the receiver is online and reciever is currenthatUser==recieverId then make message read
      #it also acts is pusher-channel
      */
      console.log(currentChatUser, senderId, currentChatUser === senderId);
      console.log(global.currentChatUserIdMap);

      /*
      if no parentMessageContent then remove 
      {parentMessageId, parentMessageContent, repliedBy} from newMessage
      */

      let _newMessage = newMessage;
      if (!newMessage.parentMessageId && !newMessage.parentMessageContent) {
        const {
          parentMessageId,
          parentMessageContent,
          repliedByUserId,
          ...rest
        } = newMessage;
        _newMessage = rest;
      }

      if (isReceiverOnline && currentChatUser === senderId) {
        _newMessage.messageStatus = MessageDeliveryStatus.READ;

        pusherServer.trigger(isReceiverOnline, "message:sent", {
          message: _newMessage,
          recieverId,
        });
      } else if (isReceiverOnline) {
        _newMessage.messageStatus = MessageDeliveryStatus.SENT;

        pusherServer.trigger(isReceiverOnline, "message:sent", {
          message: _newMessage,
          senderId,
          unread_message_count: latest_chat.unread_message_count,
        });
      }
      return res.status(201).send({ message: _newMessage });
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
    const { senderId, recieverId } = req.params;

    const privateChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { type: "PRIVATE" }, // Assuming private chat
          { chatUser: { some: { id: parseInt(senderId) } } },
          { chatUser: { some: { id: parseInt(recieverId) } } },
        ],
      },
      select: {
        chat_id: true,
      },
    });

    const lastMessage = await prisma.chat.update({
      where: { chat_id: privateChat.chat_id },
      data: {
        last_message_status: MessageDeliveryStatus.READ,
        unread_message_count: 0,
      },
      select: {
        last_message: true,
        last_message_sender_id: true,
        last_message_status: true,
        unread_message_count: true,
      },
    });

    //change unread messageStatus to read
    await prisma.messages.updateMany({
      where: {
        chatId: privateChat.chat_id,
        messageStatus: MessageDeliveryStatus.SENT,
      },
      data: {
        messageStatus: MessageDeliveryStatus.READ,
      },
    });

    const messages = await prisma.messages.findMany({
      where: { chatId: privateChat.chat_id },
      orderBy: { sent_at: "asc" },
      include: {
        reactions: true,
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

export const updateReaction = async (req, res, next) => {
  const {
    reactionType,
    parentMessageId,
    reactedByUserName,
    reactedByUserId,
    recieverId,
  } = req.body;
  try {
    const prismaInstance = getPrismaInstance();
    const reationData = await prismaInstance.messageReaction.create({
      data: {
        parentMessage: { connect: { id: parentMessageId } },
        reactionType: ReactionType[reactionType],
        reactedByUserName: reactedByUserName,
      },
    });

    /* if opposite user is online then send realtime reaction update
     sender will act as reciver at reciever's end*/
    const isRecieverOnline = onlineUsers.get(recieverId);
    /* if opposite user is online but not currentChatUser send realtime reaction update*/
    const currentChatUser = global.currentChatUserIdMap.get(recieverId);

    if (isRecieverOnline && currentChatUser === reactedByUserId) {
      pusherServer.trigger(isRecieverOnline, "private-message:reaction", {
        reationData,
        recieverId,
        reactedByUserId,
      });
    } else {
    }
    console.log("messageWithReaction", reationData);
    return res.status(201).send(reationData);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req, res, next) => {
  const { id, editedContent, senderId, recieverId } = req.body;
  console.log("editedMessage up", { id, editedContent, senderId, recieverId });
  try {
    const prismaInstance = getPrismaInstance();

    const editedMessage = await prismaInstance.messages.update({
      where: { id: id },
      data: {
        content: editedContent,
        isEdited: true,
        editedAt: new Date(),
      },
      select: {
        id: true,
        content: true,
        isEdited: true,
        editedAt: true,
      },
    });

    /* if opposite user is online then send realtime update
     sender will act as reciver at reciever's end*/
    const isRecieverOnline = onlineUsers.get(recieverId);
    /* if opposite user is online but not currentChatUser send realtime update*/
    const currentChatUser = global.currentChatUserIdMap.get(recieverId);

    if (isRecieverOnline && currentChatUser === senderId) {
      pusherServer.trigger(isRecieverOnline, "private-message:edited", {
        editedMessage,
        recieverId,
        senderId,
      });
    } else {
    }
    console.log("editedMessage", editedMessage);
    return res.status(201).send(editedMessage);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  const { id, deleteFor } = req.params;
  try {
    const prismInstance = getPrismaInstance();

    await prismInstance.messages.update({
      where: { id: id },
      data: {
        deletedFor: deleteFor,
      },
    });
    const message =
      deleteFor === "all" ? `You deleted this message` : "This Message was deleted";
    return res.status(200).send({ message });
  } catch (error) {
    next(error);
  }
};
