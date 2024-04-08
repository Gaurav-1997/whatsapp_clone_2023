import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
  getOnlineUserStatus,
  friendRequestHandler
} from "../controllers/AuthController.js";

const router = Router();
router.post("/check-user", checkUser);
router.post("/onBoardUser-user", onBoardUser);
router.get("/get-contacts/:userId", getAllUsers);
router.get("/get-user-status/:userId", getOnlineUserStatus);
router.post("/friend-request", friendRequestHandler);

export default router;
