import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

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
      throw new AppError("Không tìm thấy token xác thực", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    // decoded thường có dạng { id: user.id, ... } tùy vào lúc bạn sign token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // không trả về password
    });

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 401);
    }

    req.user = user; // gắn user (instance Sequelize) vào request
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware phân quyền theo role.
 * Dùng sau verifyToken: router.get("/admin", verifyToken, authorize("admin"), handler)
 * @param  {...string} allowedRoles - danh sách role được phép truy cập
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực người dùng", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("Bạn không có quyền truy cập tài nguyên này", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default { verifyToken, authorize };
