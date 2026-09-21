import cycleLogRepository from "../repositories/cycleLog.repository.js";
import userCycleStatRepository from "../repositories/userCycleStat.repository.js";
import AppError from "../utils/AppError.js";
import { computeCyclePrediction } from "./cyclePrediction.util.js";

class CycleLogService {
  async getUserCycles(userId) {
    return await cycleLogRepository.findAllByUser(userId);
  }

  async startCycle(userId, date) {
    const activeCycle = await cycleLogRepository.findOpenCycleByUser(userId);
    if (activeCycle) {
      throw new AppError("You already have an open cycle.", 400);
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
      throw new AppError("No open cycle found to end.", 400);
    }
    if (new Date(date) < new Date(activeCycle.startDate)) {
      throw new AppError("End date cannot be earlier than start date.", 400);
    }
    const result = await cycleLogRepository.updateEndDate(activeCycle.id, date);
    await this.recalculatePrediction(userId);
    return result;
  }

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

  async getPrediction(userId) {
    const [cycles, openCycle] = await Promise.all([
      cycleLogRepository.findAllByUser(userId),
      cycleLogRepository.findOpenCycleByUser(userId),
    ]);
    const prediction = computeCyclePrediction(cycles);

    return {
      ...prediction,
      isOnPeriod: Boolean(openCycle),
    };
  }

  _calculateCycleLength(logs) {
    if (!logs || logs.length < 4) return 28;

    let totalDays = 0;
    let validCount = 0;

    for (let i = 0; i < logs.length - 1; i++) {
      const currentDate = new Date(logs[i].startDate);
      const previousDate = new Date(logs[i + 1].startDate);
      const intervalDays = Math.round(
        (currentDate - previousDate) / (1000 * 60 * 60 * 24),
      );

      if (intervalDays > 0 && intervalDays < 60) {
        totalDays += intervalDays;
        validCount++;
      }
    }

    return validCount > 0 ? Math.round(totalDays / validCount) : 28;
  }

  _determinPhase(logs, cycleLength, safeCurrentDay, ovulationDay, periodLength) {
    const PHASE_CONTENT = {
      menstrual: {
        icon: "🩸",
        accent: "var(--color-primary-deep)",
        tint: "var(--color-primary-tint)",
        title: "Today is a period day",
        description: "It's okay to rest more — your body is working hard.",
      },
      follicular: {
        icon: "🌱",
        accent: "var(--color-cool)",
        tint: "var(--color-cool-light)",
        title: "Your energy is coming back",
        description:
          "This is a great time to start something new — your body is recharging!",
      },
      ovulation: {
        icon: "✨",
        accent: "var(--color-cool)",
        tint: "var(--color-cool-light)",
        title: "You're at your energy peak",
        description:
          "Feel free to shine — this is your best moment of the month!",
      },
      luteal: {
        icon: "🌙",
        accent: "var(--color-secondary)",
        tint: "var(--color-primary-tint)",
        title: "Your body is preparing to rest",
        description:
          "Feeling a bit tired or more irritable than usual is normal — take extra care of yourself.",
      },
      delayed: {
        icon: "⏳",
        accent: "var(--color-warm)",
        tint: "var(--color-warm-light)",
        title: "Your period is taking its time",
        description: "Cycles can fluctuate due to stress or changes. Take a deep breath and give yourself extra care today.",
      },
      noData: {
        phaseKey: "noData",
        icon: "🌸",
        accent: "var(--color-warm)",
        tint: "var(--color-warm-light)",
        title: "Take a gentle moment for yourself",
        description:
          "Log your first period when you are ready to unlock personalized phase insights and caring daily tips.",
      },
    };

    if (!logs || logs.length === 0) return PHASE_CONTENT["noData"];

    let currentPhaseKey = "luteal";
    if (safeCurrentDay > cycleLength) {
      currentPhaseKey = "delayed";
    } else if (safeCurrentDay <= periodLength) {
      currentPhaseKey = "menstrual";
    } else if (safeCurrentDay > periodLength && safeCurrentDay < ovulationDay) {
      currentPhaseKey = "follicular";
    } else if (
      safeCurrentDay >= ovulationDay &&
      safeCurrentDay <= ovulationDay + 1
    ) {
      currentPhaseKey = "ovulation";
    }

    return PHASE_CONTENT[currentPhaseKey];
  }

  async getCurrentPhaseStatus(userId) {
    const logs = await cycleLogRepository.getRecentLogs(userId, 7);

    let cycleLength = null;
    let safeCurrentDay = null;
    let ovulationDay = null;
    let periodLength = null;

    if (logs && logs.length > 0) {
      const latestLog = logs[0];
      const lastPeriodStartDate = new Date(latestLog.startDate);
      const today = new Date();

      const timeDifference =
        today.setHours(0, 0, 0, 0) - lastPeriodStartDate.setHours(0, 0, 0, 0);
      const calculatedDay =
        Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
      safeCurrentDay = calculatedDay < 1 ? 1 : calculatedDay;

      cycleLength = this._calculateCycleLength(logs);

      if (cycleLength < 20) {
        cycleLength = 28;
      }

      periodLength = 5;
      let i = 0;

      const start = new Date(logs[i].startDate);
      const end = logs[i].endDate ? new Date(logs[i].endDate) : new Date();
      const length = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (length > 0) {
        periodLength = length;
      }

      ovulationDay = cycleLength - 14;
    }

    return this._determinPhase(
      logs,
      cycleLength,
      safeCurrentDay,
      ovulationDay,
      periodLength,
    );
  }

  async createPastCycle(userId, startDate, endDate) {
    if (new Date(endDate) < new Date(startDate)) {
      throw new AppError("End date cannot be earlier than start date.", 400);
    }

    const nextCycle = await cycleLogRepository.findNextCycle(userId, startDate);

    if (nextCycle && new Date(endDate) >= new Date(nextCycle.startDate)) {
      throw new AppError("The end date of the past cycle must be earlier than the start date of the next cycle.", 400);
    }

    const result = await cycleLogRepository.createCycleLog({
      userId,
      startDate,
      endDate,
    });

    await this.recalculatePrediction(userId);
    return result;
  }
}

export default new CycleLogService();