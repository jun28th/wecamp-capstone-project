import DailyRewardRepository from "../repositories/dailyReward.repository.js";
import AppError from "../utils/AppError.js";

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

class GoalService {
  async getTodayGoal(userId) {
    return await DailyRewardRepository.findByUserAndDate(userId, todayDateOnly());
  }

  async setTodayGoal(userId, rewardText) {
    if (!rewardText || !rewardText.trim()) {
      throw new AppError("rewardText is required", 400);
    }

    const today = todayDateOnly();
    const existing = await DailyRewardRepository.findByUserAndDate(userId, today);
    if (existing) {
      return await DailyRewardRepository.updateDailyReward(existing.id, { rewardText: rewardText.trim() });
    }
    return await DailyRewardRepository.createDailyReward({
      userId,
      rewardDate: today,
      rewardText: rewardText.trim(),
    });
  }

  async deleteTodayGoal(userId) {
    const existing = await DailyRewardRepository.findByUserAndDate(userId, todayDateOnly());
    if (!existing) {
      throw new AppError("Goal not found", 404);
    }
    return await DailyRewardRepository.deleteDailyReward(existing.id);
  }
}

export default new GoalService();
