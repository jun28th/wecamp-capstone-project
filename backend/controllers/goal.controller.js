import GoalService from "../services/goal.service.js";
import { defaultUser } from "../config/defaultUser.js";

class GoalController {
  async getTodayGoal(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const goal = await GoalService.getTodayGoal(userId);
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  }

  async setTodayGoal(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      const goal = await GoalService.setTodayGoal(userId, req.body.rewardText);
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  }

  async deleteTodayGoal(req, res, next) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      await GoalService.deleteTodayGoal(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new GoalController();
