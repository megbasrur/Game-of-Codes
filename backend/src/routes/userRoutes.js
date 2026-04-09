import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.get("/me", auth, getMe);

export default router;
