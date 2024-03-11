import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);




const server = app.listen(process.env.PORT, () => {
  // code here
  console.log("Success: Server started on port", process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Client connected",socket.id);
  // console.log("Client connected",socket);
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added",onlineUsers);
  });
  
  socket.on("send-msg", (data) => {
    console.log("send-msg listened", data);
    const sendUserSocket = onlineUsers.get(data.to);
    
    console.log("msg-recieved: from",data.from);
    console.log("msg:",data.message.message);
    console.log("msg-to:",data.to);
    
    console.log("sendUserSocket: ", sendUserSocket);
    if (sendUserSocket) {
      console.log("msg-recieved: emitted")
      socket.to(sendUserSocket).emit("msg-recieved", {
        from: data.from,
        message: data.message,
      });
    }
  });
});

io.on("connect_error", (error) => {
  console.error("Connection error:", error); 
});
