import express from "express";
import cycleLogController from "../controllers/cycleLog.controller.js";
const router = express.Router();
router.get("/", cycleLogController.getCycles);
router.post("/", cycleLogController.startCycle); //start cycle
router.put("/", cycleLogController.endCycle); //end cycle
export default router;
