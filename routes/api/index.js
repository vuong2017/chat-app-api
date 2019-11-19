import express from "express";
const router = express.Router();



import user from "../../controllers/user";
import { authMiddleware } from "../../middlewares/auth";

// import user from "./user";
import twoFactor from "./two-factor";
import chatRoom from "./chat-room";
import chatMessage from "./chat-message";


router.get("/aa", (req,res) => res.json({a:process.env.DBURL}))
router.get("/bb", authMiddleware, user.get)


// router.use("/user", user);
router.use("/two-factor", twoFactor);
router.use("/chat-room", chatRoom);
router.use("/chat-message", chatMessage);


module.exports = router;
