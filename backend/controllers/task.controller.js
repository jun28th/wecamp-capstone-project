import TaskService from "../services/task.service.js";
import { defaultUser } from "../config/defaultUser.js";

class TaskController {
  async createTask(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const newTask = await TaskService.createTask(userId, req.body);
      res.status(201).json(newTask);
    } catch (error) {
      next(error)
    }
  }

  async getTasks(req, res, next) {
    try {
      const userId = req.user.id; // Giả định middleware xác thực đã gắn req.user
      const { year, month, search, dueFilter, today } = req.query;

      let tasks;
      if (year && month) {
        console.log("hello");
        tasks = await TaskService.getTasksByMonth(userId, year, month);
      } else {
        tasks = await TaskService.getTasksByUser(userId, { search, dueFilter, today });
      }

      return res.status(200).json(tasks);
    } catch (error) {
      next(error)
    }
  }

  async updateTask(req, res, next) {
    try {
      const updatedTask = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error)
    }
  }

  async deleteTask(req, res, next) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error)
    }
  }

  async toggleComplete(req, res, next) {
    try {
      const { isCompleted } = req.body;
      const updatedTask = await TaskService.toggleComplete(req.params.id, isCompleted);
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error)
    }
  }
}

export default new TaskController();
