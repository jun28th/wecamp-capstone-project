import TaskService from "../services/task.service.js";
import { defaultUser } from "../config/defaultUser.js";

function resolveUserId(req) {
  return req.user?.id ?? defaultUser.id;
}

class TaskController {
  async createTask(req, res) {
    try {
      const newTask = await TaskService.createTask(resolveUserId(req), req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTasks(req, res) {
    try {
      const tasks = await TaskService.getTasksByUser(resolveUserId(req));
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
