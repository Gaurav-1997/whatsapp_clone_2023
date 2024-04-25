import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
  getOnlineUserStatus,
  friendRequestHandler,
  addFriend
} from "../controllers/AuthController.js";

const router = Router();
router.post("/check-user", checkUser);
router.post("/onBoardUser-user", onBoardUser);
router.get("/get-contacts/:userId", getAllUsers);
router.post("/get-user-status", getOnlineUserStatus);
router.post("/friend-request", friendRequestHandler);
router.patch("/friend-request", addFriend);

export default router;
