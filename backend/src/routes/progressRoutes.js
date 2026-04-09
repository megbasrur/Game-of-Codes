import { Router } from "express";
import { completeGame, getMyProgress } from "../controllers/progressController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.get("/me", auth, getMyProgress);
router.post("/:gameId/complete", auth, completeGame);

export default router;
