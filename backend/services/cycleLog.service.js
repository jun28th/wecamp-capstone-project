import cycleLogRepository from "../repositories/cycleLog.repository.js";

class CycleLogService {
  // Lấy danh sách chu kỳ để render lịch FE
  async getUserCycles(userId) {
    const result = await cycleLogRepository.findAllByUser(userId);
    console.log(result);
    return result;
  }

  async startCycle(userId, date) {
    const activeCycle = await cycleLogRepository.findOpenCycleByUser(userId);
    if (activeCycle) {
      throw new Error("Bạn đang có một chu kỳ chưa kết thúc.");
    }
    return await cycleLogRepository.createCycleLog({
      userId,
      startDate: date,
      endDate: null,
    });
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
    return await cycleLogRepository.updateEndDate(activeCycle.id, date);
  }
}

export default new CycleLogService();
