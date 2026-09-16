import TaskService from "../services/task.service.js";
import { defaultUser } from "../config/defaultUser.js";

class TaskController {
  async createTask(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const newTask = await TaskService.createTask(userId, req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTasks(req, res) {
    try {
      const userId = req.user.id; // Giả định middleware xác thực đã gắn req.user
      const { year, month } = req.query;

      let tasks;
      if (year && month) {
        console.log("hello");
        tasks = await TaskService.getTasksByMonth(userId, year, month);
      } else {
        tasks = await TaskService.getTasksByUser(userId);
      }

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const updatedTask = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(updatedTask);
    } catch (error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async toggleComplete(req, res) {
    try {
      const { isCompleted } = req.body;
      const updatedTask = await TaskService.toggleComplete(req.params.id, isCompleted);
      res.status(200).json(updatedTask);
    } catch (error) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TaskController();
