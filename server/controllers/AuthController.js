import getPrismaInstance from "../utils/PrismaClient.js";
import { pusherServer } from "../utils/PusherServer.js";

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
      const pusherId = crypto.randomUUID(user.id);
      onlineUsers.set(user.id, pusherId);
      console.log("auth onlineUsers", onlineUsers);

      return res.json({
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
  console.log("reached onBoardUser() route in backend");
  try {
    const { email, name, profilePicture, about } = req.body;
    console.log("req.body: ", req.body);
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
      data: { email, name, profilePicture, about },
    });
    console.log("user", user);
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

    console.log(existingFriend);

    // check if reciever is online
    const chatId = global.onlineUsers.get(to);
    console.log(chatId, !existingFriend.friends.includes(from));
    if (
      chatId &&
      !existingFriend.friends.includes(from) &&
      !existingFriend.pendingRequest.includes(from)
    ) {
      const user = await prisma.user.findUnique({
        where: { id: from },
        select: {
          id: true,
          email: true,
          name: true,
          profilePicture: true,
          friends: false,
          blockedUsers: false,
          pendingRequest: false,
        },
      });
      pusherServer.trigger(`channel-${chatId}`, "event:friend-request-sent", {
        requester: user,
      });
    }
    // else{
    //   return res.status(409).json({message:'User already a friend or pendingRequest'})
    // }
    // store request in db whether user online or offline
    const pendingRequest = await prisma.user.update({
      where: { id: parseInt(to) },
      data: {
        pendingRequest: {
          push: parseInt(from),
        },
      },
    });
    return res.status(200).json(pendingRequest);
  } catch (error) {
    next(error);
  }
};

export const addFriend = async (req, res, next) => {
  try {
    const { approverId, requesterId } = req.body;
    const prisma = getPrismaInstance();
    const friendList = await prisma.user.update({
      where: { id: parseInt(approverId) },
      data: {
        friends: {
          push: parseInt(requesterId),
        },
      },
    });
    //get added friend data and send it in response

    console.log("friend pushed", friendList);
    return res.status(200).json({ friendList });
  } catch (error) {
    next(error);
  }
};

export const getUserList = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const prisma = getPrismaInstance();
    const data = await prisma.user.findMany({
      where: {
        id: {
          in: await prisma.user
            .findUnique({
              where: { id: { equals: userId } },
              select: { pendingRequest: true },
            })
            .then((res) => res.map((user) => user.id)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
