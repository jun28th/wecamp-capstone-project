import { Task } from "../models/index.js";

class TaskRepository {
  async createTask(data) {
    return await Task.create(data);
  }

  async findById(id) {
    return await Task.findByPk(id);
  }

  async findAllByUser(userId) {
    return await Task.findAll({
      where: { user_id: userId },
      order: [["due_date", "ASC"]],
    });
  }

  async updateTask(id, updates) {
    const task = await this.findById(id);
    if (!task) return null;
    return await task.update(updates);
  }

  async completeTask(id) {
    return await this.updateTask(id, {
      isCompleted: true,
      completedAt: new Date(),
    });
  }

  // Hard delete - tasks no longer has deleted_at
  async deleteTask(id) {
    return await Task.destroy({ where: { id } });
  }
}

export default new TaskRepository();
