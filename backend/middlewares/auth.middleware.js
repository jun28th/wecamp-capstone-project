import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

if (!JWT_SECRET) {
  console.warn(
    "[auth.middleware] Cảnh báo: JWT_SECRET chưa được cấu hình trong .env",
  );
}

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token đã hết hạn",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    // decoded thường có dạng { id: user.id, ... } tùy vào lúc bạn sign token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // không trả về password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    req.user = user; // gắn user (instance Sequelize) vào request
    next();
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực",
    });
  }
};

/**
 * Middleware phân quyền theo role.
 * Dùng sau verifyToken: router.get("/admin", verifyToken, authorize("admin"), handler)
 * @param  {...string} allowedRoles - danh sách role được phép truy cập
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa xác thực người dùng",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

export default { verifyToken, authorize };
