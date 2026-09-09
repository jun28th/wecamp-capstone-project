import DailyLogService from "../services/dailyLog.service.js";

class DailyLogController {
  async getTodayLog(req, res) {
    const userId = req.user.id
    try {
      const todayLog = await DailyLogService.getTodayLog(userId);
      res.status(200).json(todayLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createLog(req, res) {
    const userId = req.user.id;
    try {
      const newLog = await DailyLogService.createLog(userId, req.body);
      res.status(201).json(newLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateLog(req, res) {
  const userId = req.user.id;
  try {
    const updatedLog = await DailyLogService.updateLog(userId, req.body);
    res.status(200).json(updatedLog);
  } catch (error) {
    if (error.message === "This log has been finalized and cannot be edited") {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}
}

export default new DailyLogController();
