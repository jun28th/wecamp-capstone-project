import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import DailyLogController from "../controllers/dailyLog.controller.js";
const router = express.Router();

router.get("/", verifyToken, DailyLogController.getTodayLog)
router.patch("/", verifyToken, DailyLogController.updateLog)
router.post("/", verifyToken, DailyLogController.createLog)
export default router;