import { Op } from "sequelize";
import { DailyLog } from "../models/index.js";

class DailyLogRepository {
  async createDailyLog(data) {
    return await DailyLog.create(data);
  }

  async findById(id) {
    return await DailyLog.findByPk(id);
  }

  async findByUserAndDate(userId, logDate) {
    return await DailyLog.findOne({
      where: { user_id: userId, log_date: logDate },
    });
  }

  async findByUserRange(userId, startDate, endDate) {
    return await DailyLog.findAll({
      where: {
        user_id: userId,
        log_date: { [Op.gte]: startDate, [Op.lte]: endDate },
      },
      order: [["log_date", "ASC"]],
    });
  }

  async updateDailyLog(id, updates) {
    const log = await DailyLog.findByPk(id);
    if (!log) return null;
    return await log.update(updates);
  }

  async deleteDailyLog(id) {
    return await DailyLog.destroy({ where: { id } });
  }
}

export default new DailyLogRepository();
