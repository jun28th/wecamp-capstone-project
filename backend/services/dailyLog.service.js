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
    const existingLog = await DailyLogRepository.findByUserAndDate(
      userId,
      today,
    );
    if (!existingLog) {
      throw new Error("Today's log does not exist");
    }
    if (existingLog.isFinalized) {
      throw new Error("This log has been finalized and cannot be edited");
    }

    const updates = {};
    updates.mood = data.mood;
    updates.isFinalized = true;
    if (data.note !== undefined) updates.note = data.note;

    return await DailyLogRepository.updateDailyLog(existingLog.id, updates);
  }

  async getMoodTrend(userId, startDate, endDate) {
    const logs = await DailyLogRepository.findByUserRange(
      userId,
      startDate,
      endDate,
    );
    return logs.map((log) => ({
      date: log.logDate,
      mood: log.mood,
      note: log.note,
    }));
  }
}

export default new DailyLogService();
