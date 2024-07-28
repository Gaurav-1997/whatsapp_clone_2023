import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { job } from "./utils/cronJobs/scheduler.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/images/", express.static("uploads/images/"))

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

job.start();

/*CronJob params({
	cronTime: '* * * * * *',
	onTick: function () {
		console.log('You will see this message every second');
	},
	start: true,
	timeZone: 'America/Los_Angeles'
});*/



const server = app.listen(process.env.PORT, () => {
  // code here
  console.log("Success: Server started on port", process.env.PORT);
});

global.onlineUsers = new Map();
//currentChatUserId mapped with senderId
global.currentChatUserIdMap = new Map();
