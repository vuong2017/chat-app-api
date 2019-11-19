import express from "express";
const router = express.Router();

import user from "./user";
import twoFactor from "./two-factor";
import chatRoom from "./chat-room";
import chatMessage from "./chat-message";


router.get("/aa", (req,res) => res.json({a:1}))

router.use("/user", user);
router.use("/two-factor", twoFactor);
router.use("/chat-room", chatRoom);
router.use("/chat-message", chatMessage);


module.exports = router;
