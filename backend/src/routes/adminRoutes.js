import { Router } from "express";
import { listUsers } from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/users", auth, requireAdmin, listUsers);

export default router;
