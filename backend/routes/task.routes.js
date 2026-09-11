import express from "express";
import TaskController from "../controllers/task.controller.js";
const router = express.Router();

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.patch("/:id/complete", TaskController.toggleComplete);

export default router;
