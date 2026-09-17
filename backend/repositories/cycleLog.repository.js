import { CycleLog } from "../models/index.js";
import { Op } from "sequelize";

class CycleLogRepository {
  async createCycleLog(data) {
    return await CycleLog.create(data);
  }

  async findById(id) {
    return await CycleLog.findByPk(id);
  }

  // "Chu kỳ đang mở" - the one with no end_date yet (max 1 per user, enforced by uq_cycle_logs_open)
  async findOpenCycleByUser(userId) {
    return await CycleLog.findOne({
      where: { user_id: userId, end_date: null },
    });
  }

  async findAllByUser(userId) {
    return await CycleLog.findAll({
      where: { user_id: userId },
      order: [["start_date", "DESC"]],
    });
  }

  async closeCycle(id, endDate) {
    const cycle = await CycleLog.findByPk(id);
    if (!cycle) return null;
    return await cycle.update({ endDate });
  }

  async updateCycleLog(id, updates) {
    const cycle = await CycleLog.findByPk(id);
    if (!cycle) return null;
    return await cycle.update(updates);
  }

  async deleteCycleLog(id) {
    return await CycleLog.destroy({ where: { id } });
  }

  async updateEndDate(id, endDate) {
    const cycle = await CycleLog.findByPk(id);
    if (!cycle) return null;
    cycle.endDate = endDate;
    return await cycle.save();
  }

  async getRecentLogs(userId, limit = 6) {
    return await CycleLog.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
      limit,
    });
  }

  async findNextCycle(userId, date) {
    return await CycleLog.findOne({
      where: {
        user_id: userId,
        start_date: { [Op.gt]: date },
      },
      order: [["start_date", "ASC"]],
    });
  }
}

export default new CycleLogRepository();
