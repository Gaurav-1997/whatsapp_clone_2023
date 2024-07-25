import { Router } from "express";
import {
  addImageMessage,
  addMessage,
  editMessage,
  getMessages,
  partialDeleteMessage,
  permaDeleteMessage,
  updateReaction,
} from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

// const uploadDir = path.join(__dirname, 'uploads/images');

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
const uploadImage = multer({ dest: "uploads/images/" });

router.post("/add-messages", addMessage);
router.put("/add-messages", editMessage);
router.put("/delete-message", partialDeleteMessage);
router.delete("/delete-message/:id", permaDeleteMessage);
router.get("/get-messages/:privateChatId/:recieverId/:senderId", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/reaction-message", updateReaction);

export default router;
