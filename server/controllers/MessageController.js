import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import { pusherServer } from "../utils/PusherServer.js";
import { MessageDeliveryStatus, MessageType } from "@prisma/client";

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
          parentMessageId : parentMessageId || null,
          parentMessageContent: parentMessage || null,
          repliedByUserId : repliedBy.toString() || null
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
          repliedByUserId: true
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

      /* trigger a pusher event for a specific chat for new message*/

      // Check if the receiver is online and reciever is currenthatUser==recieverId then make message read
      // it also acts is pusher-channel
      console.log(currentChatUser, senderId, currentChatUser === senderId);
      console.log(global.currentChatUserIdMap);

      
      /*
      if no parentMessageContent then remove 
      {parentMessageId, parentMessageContent, repliedBy} from newMessage
      */
     
     let _newMessage = newMessage;
     if(!newMessage.parentMessageId && !newMessage.parentMessageContent){
       const {parentMessageId, parentMessageContent, repliedByUserId, ...rest} = newMessage;
       _newMessage = rest;
      }
      console.log("_newMessage",_newMessage)

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
    });

    // const unreadMessages = [];

    // messages.forEach((message, idx) => {
    //   if (
    //     message.messageStatus !== MessageDeliveryStatus.READ &&
    //     message.senderId === parseInt(recieverId)
    //   ) {
    //     messages[idx].messageStatus = MessageDeliveryStatus.READ;
    //     unreadMessages.push(message.id);
    //   }
    // });

    // await prisma.messages.updateMany({
    //   where: { id: { in: unreadMessages } },
    //   data: { messageStatus: MessageDeliveryStatus.READ },
    // });

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
