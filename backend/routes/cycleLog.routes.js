import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import cycleLogController from "../controllers/cycleLog.controller.js";
const router = express.Router();
router.get("/", verifyToken, cycleLogController.getCycles);
router.post("/", verifyToken, cycleLogController.startCycle); //start cycle
router.put("/", verifyToken, cycleLogController.endCycle); //end cycle
export default router;
