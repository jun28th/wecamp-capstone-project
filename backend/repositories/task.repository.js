import { Op } from "sequelize";
import { Task } from "../models/index.js";

// Mechanical translation of the service's due-date criteria into a where clause.
function dueCriteriaToWhere(due) {
  if (!due) return {};
  const where = {};
  if (due.none) where.due_date = { [Op.is]: null };
  else if (due.on) where.due_date = due.on;
  else if (due.from) where.due_date = { [Op.between]: [due.from, due.to] };
  else if (due.before) where.due_date = { [Op.lt]: due.before };
  if (due.incompleteOnly) where.is_completed = false;
  return where;
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
