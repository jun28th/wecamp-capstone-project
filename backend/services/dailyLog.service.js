import DailyLogRepository from "../repositories/dailyLog.repository.js";

class DailyLogService {
  async getTodayLog(userId) {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const todayLog = await DailyLogRepository.findByUserAndDate(userId, today);
    return todayLog;
  }
  async createLog(userId, data) {
    const today = new Date().toISOString().slice(0, 10);
    const { mood, note } = data;

    if (mood == null && note == null) {
      throw new Error("mood or note is required");
    }

    const payload = { userId, logDate: today };
    if (mood !== undefined) payload.mood = mood;
    if (note !== undefined) payload.note = note;

    const newLog = await DailyLogRepository.createDailyLog(payload);
    return newLog;
  }
  async updateLog(userId, data) {
    const today = new Date().toISOString().slice(0, 10);
    const { mood, note } = data;

    const existingLog = await DailyLogRepository.findByUserAndDate(
      userId,
      today,
    );
    if (!existingLog) {
      throw new Error("Today's log does not exist");
    }

    const updates = {};
    if (mood !== undefined) updates.mood = mood;
    if (note !== undefined) updates.note = note;

    const updatedLog = await DailyLogRepository.updateDailyLog(
      existingLog.id,
      updates,
    );
    return updatedLog;
  }
}

export default new DailyLogService();
