import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { USER_MANAGER_ROLES } from "../constants/roles";

const router = Router();

router.use(requireAuth, requireRole(...USER_MANAGER_ROLES));

router.get("/", usersController.list);
router.post("/", usersController.create);
router.get("/:id", usersController.getOne);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);
router.patch("/:id/status", usersController.setStatus);

export default router;
