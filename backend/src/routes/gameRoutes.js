import { Router } from "express";
import { createGame, listGames } from "../controllers/gameController.js";
import { auth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/", auth, listGames);
router.post("/", auth, requireAdmin, createGame);

export default router;
