import express from "express";
const router = express.Router();

import chatMessage from "../../controllers/chat-message";
import { authMiddleware } from "../../middlewares/auth";

router.get("/room/:roomId", authMiddleware, chatMessage.getMessageRoom);
router.post("/", authMiddleware, chatMessage.create); 
router.patch("/room/:roomId", authMiddleware, chatMessage.updateReadMessageRoom);
module.exports = router;
