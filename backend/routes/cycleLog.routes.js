import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import cycleLogController from "../controllers/cycleLog.controller.js";
const router = express.Router();
router.get("/", verifyToken, cycleLogController.getCycles);
router.get("/prediction", verifyToken, cycleLogController.getPrediction); //next-period prediction
router.post("/", verifyToken, cycleLogController.startCycle); //start cycle
router.put("/", verifyToken, cycleLogController.endCycle); //end cycle
router.get('/phase-message', verifyToken, cycleLogController.getCurrentPhase); // get current phase
export default router;
