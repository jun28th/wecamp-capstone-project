import DailyLogService from "../services/dailyLog.service.js";

class DailyLogController {
  async getTodayLog(req, res, next) {
    try {
      const userId = req.user.id;
      const todayLog = await DailyLogService.getTodayLog(userId);
      res.status(200).json(todayLog);
    } catch (error) {
      next(error);
    }
  }

  async createLog(req, res, next) {
    try {
      const userId = req.user.id;
      const newLog = await DailyLogService.createLog(userId, req.body);
      res.status(201).json(newLog);
    } catch (error) {
      next(error);
    }
  }

  async updateLog(req, res, next) {
    try {
      const userId = req.user.id;
      const updatedLog = await DailyLogService.updateLog(userId, req.body);
      res.status(200).json(updatedLog);
    } catch (error) {
      next(error);
    }
  }

  async getMoodTrend(req, res, next) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      const moodTrend = await DailyLogService.getMoodTrend(
        userId,
        startDate,
        endDate,
      );
      res.status(200).json(moodTrend);
    } catch (error) {
      next(error);
    }
  }
}

export default new DailyLogController();