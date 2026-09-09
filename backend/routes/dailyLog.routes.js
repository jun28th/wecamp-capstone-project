import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import DailyLogController from "../controllers/dailyLog.controller.js";
const router = express.Router();

router.get("/", DailyLogController.getTodayLog)
router.patch("/", DailyLogController.updateLog)
router.post("/", DailyLogController.createLog)
export default router;