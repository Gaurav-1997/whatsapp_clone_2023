import getPrismaInstance from "../utils/PrismaClient.js";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    // const { message, from, to } = req.body;

    // The message to send.
    const message = req.body.message;

    // The ID of the sender.
    const from = parseInt(req.body.from);

    // The ID of the receiver.
    const to = parseInt(req.body.to);

    // Check if the receiver is online.
    const isReceiverOnline = onlineUsers.get(to);
    console.log("req.body: ", req.body);

    if (message && from && to) {
      // console.log("got message", message, from, to);
      const newMessage = await prisma.messages.create({
        data: {
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          message: message,
          messageStatus: isReceiverOnline ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From, to you Message is required.");
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
