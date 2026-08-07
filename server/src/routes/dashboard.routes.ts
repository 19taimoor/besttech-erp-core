import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { INTERNAL_ROLES } from "../constants/roles";

const router = Router();

router.get("/stats", requireAuth, requireRole(...INTERNAL_ROLES), dashboardController.stats);

export default router;
