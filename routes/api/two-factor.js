import express from "express";
const router = express.Router();

import twoFactor from "../../controllers/two-factor";
import { authMiddleware, authMiddlewareTwoFactor } from "../../middlewares/auth";

router.post("/totp-validate", authMiddlewareTwoFactor, twoFactor.totpValidate);
router.post("/turn-on-two-factor", authMiddleware, twoFactor.turnOnTwoFactor);


module.exports = router;
