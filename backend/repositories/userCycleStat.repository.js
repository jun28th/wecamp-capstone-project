import { UserCycleStat } from "../models/index.js";

class UserCycleStatRepository {
  async findByUser(userId) {
    return await UserCycleStat.findByPk(userId);
  }

  async upsertStats(userId, stats) {
    const [record] = await UserCycleStat.upsert({
      userId,
      ...stats,
      lastCalculatedAt: new Date(),
    });
    return record;
  }
}

export default new UserCycleStatRepository();
