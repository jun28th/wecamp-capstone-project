import GoalService from "../services/goal.service.js";
import { defaultUser } from "../config/defaultUser.js";

class GoalController {
  async getTodayGoal(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const goal = await GoalService.getTodayGoal(userId);
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async setTodayGoal(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const goal = await GoalService.setTodayGoal(userId, req.body.rewardText);
      res.status(200).json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTodayGoal(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      await GoalService.deleteTodayGoal(userId);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Goal not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GoalController();
