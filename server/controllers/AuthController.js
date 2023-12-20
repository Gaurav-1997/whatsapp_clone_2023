import getPrismaInstance from "../utils/PrismaClient.js";

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
      return res.json({ message: "User found", status: true, data: user });
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
  console.log("getAllUsers called", userId);
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      where: { id: { not: parseInt(userId) } },
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
