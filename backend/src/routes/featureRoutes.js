import { Router } from "express";
import { getFeatures } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.get("/", auth, getFeatures);

export default router;
