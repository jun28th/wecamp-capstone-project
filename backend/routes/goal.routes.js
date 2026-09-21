import express from "express";
import GoalController from "../controllers/goal.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/today", verifyToken, GoalController.getTodayGoal);
router.put("/today", verifyToken, GoalController.setTodayGoal);
router.delete("/today", verifyToken, GoalController.deleteTodayGoal);

export default router;
