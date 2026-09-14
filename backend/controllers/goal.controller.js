import GoalService from "../services/goal.service.js";
import { defaultUser } from "../config/defaultUser.js";

function resolveUserId(req) {
  return req.user?.id ?? defaultUser.id;
}

class GoalController {
  async getTodayGoal(req, res) {
    try {
      const goal = await GoalService.getTodayGoal(resolveUserId(req));
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async setTodayGoal(req, res) {
    try {
      const goal = await GoalService.setTodayGoal(resolveUserId(req), req.body.rewardText);
      res.status(200).json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTodayGoal(req, res) {
    try {
      await GoalService.deleteTodayGoal(resolveUserId(req));
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
