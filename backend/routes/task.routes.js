import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import TaskController from "../controllers/task.controller.js";
const router = express.Router();

router.get("/", verifyToken, TaskController.getTasks);
router.post("/", verifyToken, TaskController.createTask);
router.put("/:id", verifyToken, TaskController.updateTask);
router.delete("/:id", verifyToken, TaskController.deleteTask);
router.patch("/:id/complete", verifyToken, TaskController.toggleComplete);

export default router;
