import express from "express";
const router = express.Router();
import { authMiddleware } from "../../middlewares/auth";

import user from "../../controllers/user";

router.get("/", authMiddleware, user.get);
router.post("/login", user.login);
router.post("/register", user.register);
router.post("/logout", user.logout);
router.post("/forgot-password", user.forgotPassword);
router.post("/check-token-reset-password", user.checkTokenResetPassword);
router.post("/reset-password", user.resetPassword);
router.get("/me", authMiddleware, user.getMe);


module.exports = router;
