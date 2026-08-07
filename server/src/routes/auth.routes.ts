import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { loginRateLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", loginRateLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);
router.put("/me", requireAuth, authController.updateProfile);

export default router;
