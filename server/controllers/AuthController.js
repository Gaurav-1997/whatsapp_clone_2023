import { constants } from "crypto";
import getPrismaInstance from "../utils/PrismaClient.js";
import { pusherServer } from "../utils/PusherServer.js";
import { ChatType } from "@prisma/client";
import { send } from "process";
import { connect } from "tls";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ message: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: "User not found", staus: false });
    } else {
      // user.friends = await getContactList(user.friends, next);
      // user.blockedUsers = await getContactList(user.blockedUsers, next);
      // user.pendingRequest = await getContactList(user.pendingRequest, next);

      const pusherId = crypto.randomUUID(user.id);
      onlineUsers.set(user.id, pusherId);
    

      return res.status(200).json({
        message: "User found",
        status: true,
        data: { ...user, pusherId },
      });
    }
  } catch (err) {
    next(err);
  }
};

// get the data from frontend & save it to db
export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, profilePicture, about } = req.body;
    
    if (!email || !name || !profilePicture) {
      res.status(400).json({ message: "Email, name & image required !!" });
      return;
    }
    const prisma = getPrismaInstance();
    const id = Number(
      Math.floor(Date.now() * Math.random())
        .toString()
        .substring(0, 6)
    );
    const user = await prisma.user.create({
      data: { id, email, name, profilePicture, about },
    });
    
    res.status(201).json({ message: "Success", status: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      where: { NOT: { id: { equals: parseInt(userId) } } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });
    // TODO: make sure to not send loggedIn user data in users array, filter it out here in backend
    const usersGroupByInitialLetter = {};

    users.map((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (userId && !usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });
    
    return res.status(200).json({ users: usersGroupByInitialLetter });
  } catch (error) {
    next(error);
  }
};

export const getOnlineUserStatus = (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log("onlineUsers", onlineUsers);
    const userStatus = onlineUsers.get(Number(userId)) ? true : false;
    console.log("getOnlineUserStatus", userId, userStatus);
    return res.status(200).json({ userStatus });
  } catch (error) {
    next(error);
  }
};

export const friendRequestHandler = async (req, res, next) => {
  try {
    console.log("friendRequestHandler", req.body);
    const prisma = getPrismaInstance();
    const { from, to } = req.body;

    // first check whether the fried exists already
    const existingFriend = await prisma.user.findUnique({
      where: { id: parseInt(to) },
      select: { friends: true, pendingRequest: true },
    });

    // check if reciever is online
    const chatId = global.onlineUsers.get(to);
    console.log(chatId, !existingFriend.friends.includes(from));

    const [requester] = await prisma.$transaction(async (prismaTx) => {
      if (!existingFriend.friends.includes(from) &&
        !existingFriend.pendingRequest.includes(from)
      ) {

        // add appoverId i.e, to in requestSentTo field
        const requester = await prismaTx.user.update({
          where: { id: from },
          data: {
            requestSentTo: { push: parseInt(to) },
          },
          select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
            status: true,
            friends: true,
            blockedUsers: true,
            requestSentTo: true,
            pendingRequest:true
          },
        });
        console.log("request",requester)

        // send friend request to reciever if he is online
        if(chatId){
          pusherServer.trigger(`channel-${chatId}`, "incoming-friend-request", {
            requester: {
              id: requester.id,
              name: requester.name,
              email: requester.email,
              profilePicture: requester.profilePicture,
            },
          });
        }
        
        // store request in db whether user online or offline
        await prismaTx.user.update({
          where: { id: parseInt(to) },
          data: {
            pendingRequest: {
              push: parseInt(from),
            },
          },
        });
        return [requester];
      } else {
        return res
          .status(200)
          .json({ message: "User already a friend or in pendingRequest" });
      }
    });
    
    return res.status(200).json({ message: "Request Sent Success", user:requester });
  } catch (error) {
    next(error);
  }
};

export const addFriend = async (req, res, next) => {
  try {
    const { approverId, requesterId, isAccepted } = req.body;
    const prisma = getPrismaInstance();

    const approver = await prisma.user.findFirst({
      where: { id: approverId },
      select: { id: true, pendingRequest: true },
    });

    // Remove requester ID from pending requests
    const updatedList = approver.pendingRequest.filter(
      (id) => id !== requesterId
    );
    
    if (isAccepted) {
      // Transaction for creating chat and updating user data
      const [approverData] = await prisma.$transaction(async (prismaTx) => {
        // Fetch approver data (including pendingRequest)

        // Create private chat
        const privateChat = await prismaTx.chat.create({
          data: {
            type: ChatType.PRIVATE,
            chatUser: { connect: [{ id: requesterId }, { id: approverId }] },
          },
          select: {
            chat_id: true,
            chatUser: { select: { name: true, id: true } },
          },
        });
        

        // Update approver data (friends, pendingRequest, chat)

        const approverData = await prismaTx.user.update({
          where: { id: approverId },
          data: {
            friends: { push: requesterId },
            pendingRequest: { set: updatedList },
            chat: { connect: { chat_id: privateChat.chat_id } },
          },
          select: {
            id: true,
            name: true,
            profilePicture: true,
            about: true,
            pendingRequest: true,
            chat: { select: { chat_id: true } },
          },
        });
        

        // Update requester data (friends, chat)
        const requester = await prismaTx.user.findFirst({
          where: { id: requesterId },
          select: { requestSentTo: true },
        });

        const requesterData = await prismaTx.user.update({
          where: { id: requesterId },
          data: {
            friends: { push: approverId },
            requestSentTo: {
              set: requester.requestSentTo.filter((id) => id !== approverId),
            },
            chat: { connect: { chat_id: privateChat.chat_id } },
          },
          select: {
            id: true,
            email: true,
            requestSentTo: true,
            chat: { select: { chat_id: true } },
          },
        });
        

        return [approverData];
      });

      // Push data to requester (if online)
      const chatId = global.onlineUsers.get(requesterId);
      if (chatId) {
        pusherServer.trigger(
          `channel-${chatId}`,
          "friend-request-accepted",
          approverData
        );
      }

      return res.status(200).json({
        message: `${requesterId} added as friend successfully`,
        isAccepted: true,
        approverData,
      });
    } else {
      // Update approver's pending request list (if declining)
      await prisma.user.update({
        where: { id: parseInt(approverId) },
        data: { pendingRequest: { set: updatedList } },
      });

      return res.status(204).json({
        message: `${requesterId} request declined`,
        isAccepted: false,
        requesterId,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getContactList = async (contactIds, next) => {
  try {
    const prisma = getPrismaInstance();
    const data = await prisma.user.findMany({
      where: {
        id: {
          in: contactIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        profilePicture: true,
      },
    });
    
    return data;
  } catch (error) {
    next(error);
  }
};

const createPrivateChat = async (req, res, next) => {};

/*
export const addFriend = async (req, res, next) => {
  try {
    const { approverId, requesterId, isAccepted } = req.body;
    const prisma = getPrismaInstance();

    // Begin a transaction
    await prisma.$transaction(async (prisma) => {
      if (isAccepted) {
        // Create a private chat
        const privateChat = await prisma.chat.create({
          data: { type: ChatType.PRIVATE, sender_id: requesterId },
        });

        // Update the approver's data
        await prisma.user.update({
          where: { id: approverId },
          data: {
            friends: { push: requesterId },
            pendingRequest: { set: { remove: requesterId } },
            chat: { connect: { chat_id: privateChat.chat_id } },
          },
        });

        // Update the requester's data
        await prisma.user.update({
          where: { id: requesterId },
          data: {
            friends: { push: approverId },
            chat: { connect: { chat_id: privateChat.chat_id } },
          },
        });
      } else {
        // Update the approver's data if the request is declined
        await prisma.user.update({
          where: { id: parseInt(approverId) },
          data: {
            pendingRequest: { set: { remove: requesterId } },
          },
        });
      }
    });

    return res.status(200).json({ message: 'Friend request processed successfully.' });
  } catch (error) {
    next(error);
  }
};

*/
