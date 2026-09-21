// middlewares/error.middleware.js
import AppError from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message, extra } = err;

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "The token has expired.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = "Invalid data";
    extra = { errors: err.errors?.map((e) => e.message) };
  } else if (!err.isOperational) {
    statusCode = 500;
    message = "A system error has occurred.";
  }

  if (process.env.NODE_ENV !== "production" || statusCode === 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl} -`, err);
  }

  return res.status(statusCode).json({
    success: false,
    message: message || "Server error",
    ...(extra && Object.keys(extra).length ? { extra } : {}),
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};