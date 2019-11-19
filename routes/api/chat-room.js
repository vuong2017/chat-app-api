import express from "express";
const router = express.Router();

import chatRoom from "../../controllers/chat-room";
import { authMiddleware } from "../../middlewares/auth";

router.get("/", authMiddleware, chatRoom.get);
router.post("/", authMiddleware, chatRoom.create); 
router.patch("/:roomId", authMiddleware, chatRoom.update);
module.exports = router;
