import TaskRepository from "../repositories/task.repository.js";

const REQUIRED_FIELDS = ["title", "dueDate", "priority"];

function validateTaskInput(data) {
  const missing = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`${missing.join(", ")} is required`);
  }
}

class TaskService {
  async createTask(userId, data) {
    validateTaskInput(data);
    const { title, dueDate, priority } = data;
    return await TaskRepository.createTask({ userId, title, dueDate, priority });
  }

  async getTasksByUser(userId) {
    return await TaskRepository.findAllByUser(userId);
  }

  async updateTask(id, data) {
    const { title, dueDate, priority } = data;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;

    const updated = await TaskRepository.updateTask(id, updates);
    if (!updated) {
      throw new Error("Task not found");
    }
    return updated;
  }

  async deleteTask(id) {
    const deletedCount = await TaskRepository.deleteTask(id);
    if (!deletedCount) {
      throw new Error("Task not found");
    }
    return deletedCount;
  }

  async toggleComplete(id, isCompleted) {
    const updated = await TaskRepository.updateTask(id, {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });
    if (!updated) {
      throw new Error("Task not found");
    }
    return updated;
  }
}

export default new TaskService();
