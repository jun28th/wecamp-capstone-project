import cycleLogService from "../services/cycleLog.service.js";

class CycleLogController {
  // GET /api/cycles
  async getCycles(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      // const userId = "12783041-a412-4e53-8c4d-bc873c129aeb";
      const cycles = await cycleLogService.getUserCycles(userId);
      return res.status(200).json({ success: true, data: cycles });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async startCycle(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      // const userId = "12783041-a412-4e53-8c4d-bc873c129aeb";
      const { date } = req.body; // actionType: 'START' | 'END'
      console.log("hello");
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin date.",
        });
      }

      const result = await cycleLogService.startCycle(userId, date);

      return res.status(200).json({
        success: true,
        message: "Tạo mới chu kỳ thành công.",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async endCycle(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware authen
      // const userId = "12783041-a412-4e53-8c4d-bc873c129aeb";
      const { date } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin date.",
        });
      }

      const result = await cycleLogService.endCycle(userId, date);

      return res.status(200).json({
        success: true,
        message: "Kết thúc chu kỳ thành công.",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new CycleLogController();
