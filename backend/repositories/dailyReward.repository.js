import { DailyReward } from "../models/index.js";

class DailyRewardRepository {
  async createDailyReward(data) {
    return await DailyReward.create(data);
  }

  async findById(id) {
    return await DailyReward.findByPk(id);
  }

  // (user_id, reward_date) is unique - at most one reward row per user per day
  async findByUserAndDate(userId, rewardDate) {
    return await DailyReward.findOne({
      where: { user_id: userId, reward_date: rewardDate },
    });
  }

  async findAllByUser(userId) {
    return await DailyReward.findAll({
      where: { user_id: userId },
      order: [["reward_date", "DESC"]],
    });
  }

  async unlockReward(id) {
    const reward = await DailyReward.findByPk(id);
    if (!reward) return null;
    return await reward.update({ isUnlocked: true, unlockedAt: new Date() });
  }

  async deleteDailyReward(id) {
    return await DailyReward.destroy({ where: { id } });
  }
}

export default new DailyRewardRepository();
