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

app.use("/uploads/images/", express.static("uploads/images/"))

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);




const server = app.listen(process.env.PORT, () => {
  // code here
  console.log("Success: Server started on port", process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

global.onlineUsers = new Map();

// const friendRequestChannel = pusherServer.trigger('channel:friend-request','event:friend-request-sent',)

// io.on("connection", (socket) => {
//   console.log("Client connected",socket.id);
  
//   global.chatSocket = socket;

//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log("User added",onlineUsers);
//   });
  
//   socket.on("send-msg", (data) => {
//     console.log("send-msg listened");
//     const sendUserSocket = onlineUsers.get(data.to);
    
//     // console.log("msg-recieved: from",data.from);
//     // console.log("msg:",data.message.message);
//     // console.log("msg-to:",data.to);
    
//     console.log("sendUserSocket: ", sendUserSocket);
//     if (sendUserSocket) {
//       // console.log("msg-recieved: emitted")
//       socket.to(sendUserSocket).emit("msg-recieved", {
//         from: data.from,
//         message: data.message,
//       });
//     }
//   });

//   socket.on("friend-request-sent", (data)=>{
//     console.log("friend-request listened", data)
//     console.log("onlineUsers", onlineUsers);

//     const recieverIsConnected = onlineUsers.get(data.receiverId)
//     console.log(recieverIsConnected);
//     if(recieverIsConnected){
//       console.log("friend-request-recieved: emitted")
//       socket.to(recieverIsConnected).emit("friend-request-recieved",{
//         from: data.senderId
//       })
//     }
//   })
// });

// io.on("connect_error", (error) => {
//   console.error("Connection error:", error); 
// });

// io.on('disconnect', () => {
//   console.log('a user disconnected');
// });
