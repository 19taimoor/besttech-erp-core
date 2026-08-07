import { Router } from "express";
import * as rolesController from "../controllers/roles.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { USER_MANAGER_ROLES } from "../constants/roles";

const router = Router();

router.get("/", requireAuth, requireRole(...USER_MANAGER_ROLES), rolesController.list);

export default router;
