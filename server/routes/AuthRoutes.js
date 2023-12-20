import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
} from "../controllers/AuthController.js";

const router = Router();
router.post("/check-user", checkUser);
router.post("/onBoardUser-user", onBoardUser);
router.get("/get-contacts/:userId", getAllUsers);

export default router;
