import { Op } from "sequelize";
import { Task } from "../models/index.js";

// Mechanical translation of the service's due-date criteria into a where clause.
function dueCriteriaToWhere(due) {
  if (!due) return {};
  if (due.none) return { due_date: { [Op.is]: null } };
  if (due.on) return { due_date: due.on };
  if (due.from) return { due_date: { [Op.between]: [due.from, due.to] } };
  if (due.before) {
    return {
      due_date: { [Op.lt]: due.before },
      ...(due.incompleteOnly && { is_completed: false }),
    };
  }
  return {};
}

class TaskRepository {
  async createTask(data) {
    return await Task.create(data);
  }

  async findById(id) {
    return await Task.findByPk(id);
  }

  async findAllByUser(userId, { search, due } = {}) {
    const where = { user_id: userId, ...dueCriteriaToWhere(due) };
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
