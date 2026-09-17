class AppError extends Error {
  /**
   * @param {string} message - Thông điệp lỗi (hiển thị cho client)
   * @param {number} statusCode - HTTP status code
   * @param {object} [extra] - Thông tin bổ sung (vd: errors validate)
   */
  constructor(message, statusCode = 500, extra = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.extra = extra;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;