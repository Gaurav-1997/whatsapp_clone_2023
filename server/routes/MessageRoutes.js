import { Router } from "express";
import { addImageMessage, addMessage, getMessages } from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

// const uploadDir = path.join(__dirname, 'uploads/images');

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
const uploadImage = multer({dest: "uploads/images/"})

router.post("/add-messages", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message",uploadImage.single("image"), addImageMessage);

export default router;