import TaskRepository from "../repositories/task.repository.js";

const REQUIRED_FIELDS = ["title"];

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

  async getTasksByUser(userId, filters = {}) {
    const search = filters.search?.trim();
    return await TaskRepository.findAllByUser(userId, { search });
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

  async getTasksByMonth(userId, year, month) {
    const formattedMonth = String(month).padStart(2, "0");
    const startDate = `${year}-${formattedMonth}-01`;
    // Lấy ngày cuối cùng của tháng
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    const tasks = await TaskRepository.findAllByUserAndMonth(userId, startDate, endDate);

    // Map thêm trường isUrgent dựa trên priority để FE dễ hiển thị
    return tasks.map((task) => {
      const plain = task.get({ plain: true });
      return {
        ...plain,
        isUrgent: plain.priority === "urgent",
      };
    });
  }
}

export default new TaskService();
