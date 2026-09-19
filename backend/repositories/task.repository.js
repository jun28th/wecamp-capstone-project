import { Op } from "sequelize";
import { Task } from "../models/index.js";

class TaskRepository {
  async createTask(data) {
    return await Task.create(data);
  }

  async findById(id) {
    return await Task.findByPk(id);
  }

  async findAllByUser(userId, { search } = {}) {
    const where = { user_id: userId };
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    return await Task.findAll({
      where,
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

  async findAllByUserAndMonth(userId, startDate, endDate) {
    return await Task.findAll({
      where: {
        user_id: userId,
        due_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["due_date", "ASC"]],
    });
  }
}

export default new TaskRepository();
