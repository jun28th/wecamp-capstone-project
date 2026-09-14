import express from "express";
import GoalController from "../controllers/goal.controller.js";
const router = express.Router();

router.get("/today", GoalController.getTodayGoal);
router.put("/today", GoalController.setTodayGoal);
router.delete("/today", GoalController.deleteTodayGoal);

export default router;
