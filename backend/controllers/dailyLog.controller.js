import DailyLogService from "../services/dailyLog.service.js";

class DailyLogController {
  async getTodayLog(req, res) {
    // const userId = req.user.id
    const userId = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
    try {
      const todayLog = await DailyLogService.getTodayLog(userId);
      res.status(200).json(todayLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createLog(req, res) {
    //const userId = req.user.id;
    const userId = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
    try {
      const newLog = await DailyLogService.createLog(userId, req.body);
      res.status(201).json(newLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateLog(req, res) {
  //const userId = req.user.id;
  const userId = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
  try {
    const updatedLog = await DailyLogService.updateLog(userId, req.body);
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}

export default new DailyLogController();
