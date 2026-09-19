import cycleLogService from "../services/cycleLog.service.js";
import AppError from "../utils/AppError.js";

class CycleLogController {
  async getCycles(req, res, next) {
    try {
      const userId = req.user.id; 
      const cycles = await cycleLogService.getUserCycles(userId);
      return res.status(200).json({ success: true, data: cycles });
    } catch (error) {
      next(error);
    }
  }

  async startCycle(req, res, next) {
    try {
      const userId = req.user.id; 
      const { date } = req.body; 
      if (!date) {
        throw new AppError("Thiếu thông tin date.", 400);
      }

      const result = await cycleLogService.startCycle(userId, date);

      return res.status(200).json({
        success: true,
        message: "Tạo mới chu kỳ thành công.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async endCycle(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const { date } = req.body;

      if (!date) {
        throw new AppError("Thiếu thông tin date.", 400);
      }

      const result = await cycleLogService.endCycle(userId, date);

      return res.status(200).json({
        success: true,
        message: "Kết thúc chu kỳ thành công.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPrediction(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const prediction = await cycleLogService.getPrediction(userId);
      return res.status(200).json({ success: true, data: prediction });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentPhase(req, res, next) {
    try {
      const userId = req.user.id;

      if (!userId) {
        throw new AppError("Thiếu thông tin định danh người dùng (userId)", 400);
      }

      const result = await cycleLogService.getCurrentPhaseStatus(userId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createPastCycle(req, res, next) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        throw new AppError( "Thiếu thông tin startDate hoặc endDate.", 400);
      }

      const result = await cycleLogService.createPastCycle(userId, startDate, endDate);

      return res.status(200).json({
        success: true,
        message: "Log chu kỳ quá khứ thành công.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CycleLogController();
