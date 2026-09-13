import cycleLogRepository from "../repositories/cycleLog.repository.js";
import userCycleStatRepository from "../repositories/userCycleStat.repository.js";
import { computeCyclePrediction } from "./cyclePrediction.util.js";

class CycleLogService {
  // Lấy danh sách chu kỳ để render lịch FE
  async getUserCycles(userId) {
    return await cycleLogRepository.findAllByUser(userId);
  }

  async startCycle(userId, date) {
    const activeCycle = await cycleLogRepository.findOpenCycleByUser(userId);
    if (activeCycle) {
      throw new Error("Bạn đang có một chu kỳ chưa kết thúc.");
    }
    const result = await cycleLogRepository.createCycleLog({
      userId,
      startDate: date,
      endDate: null,
    });
    await this.recalculatePrediction(userId);
    return result;
  }

  async endCycle(userId, date) {
    const activeCycle = await cycleLogRepository.findOpenCycleByUser(userId);
    if (!activeCycle) {
      throw new Error("Không tìm thấy chu kỳ đang mở để kết thúc.");
    }
    // Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
    if (new Date(date) < new Date(activeCycle.startDate)) {
      throw new Error("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
    }
    const result = await cycleLogRepository.updateEndDate(activeCycle.id, date);
    await this.recalculatePrediction(userId);
    return result;
  }

  // AC5: recompute + persist stats/prediction whenever cycle data changes.
  // Runs off the freshest data in DB, so callers don't need to pass anything in.
  async recalculatePrediction(userId) {
    const cycles = await cycleLogRepository.findAllByUser(userId);
    const prediction = computeCyclePrediction(cycles);

    await userCycleStatRepository.upsertStats(userId, {
      completedCycleCount: cycles.filter((c) => c.endDate).length,
      avgCycleLengthDays: prediction.avgCycleLengthDays,
      avgPeriodLengthDays: prediction.avgPeriodLengthDays,
      cycleLengthStddev: prediction.cycleLengthStddev,
      predictedNextStart: prediction.predictedNextStart,
    });

    return prediction;
  }

  // AC1-AC4, AC7: single endpoint the FE calendar + dashboard both call.
  async getPrediction(userId) {
    const [cycles, openCycle] = await Promise.all([
      cycleLogRepository.findAllByUser(userId),
      cycleLogRepository.findOpenCycleByUser(userId),
    ]);
    const prediction = computeCyclePrediction(cycles);

    return {
      ...prediction,
      // AC4: dashboard should only surface "next cycle in X days" copy when
      // the user isn't already mid-period; FE decides display, we just flag it.
      isOnPeriod: Boolean(openCycle),
    };
  }
}

export default new CycleLogService();
