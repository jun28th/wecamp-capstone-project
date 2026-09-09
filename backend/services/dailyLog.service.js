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
    if (data.mood !== undefined) updates.mood = data.mood;
    if (data.note !== undefined) updates.note = data.note;

    // Tính giá trị mood/note SAU khi update để check điều kiện finalize
    const finalMood =
      updates.mood !== undefined ? updates.mood : existingLog.mood;
    const finalNote =
      updates.note !== undefined ? updates.note : existingLog.note;

    if (finalMood != null && finalNote) {
      updates.isFinalized = true;
    }

    return await DailyLogRepository.updateDailyLog(existingLog.id, updates);
  }
}

export default new DailyLogService();
