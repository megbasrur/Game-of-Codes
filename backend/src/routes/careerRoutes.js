import { Router } from "express";
import { getCareerResult, saveCareerResult } from "../controllers/careerController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.get("/me", auth, getCareerResult);
router.post("/", auth, saveCareerResult);

export default router;
