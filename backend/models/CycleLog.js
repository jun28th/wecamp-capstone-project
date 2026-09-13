import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class CycleLog extends Model {}
CycleLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "end_date",
    },
  },
  {
    sequelize,
    modelName: "CycleLog",
    tableName: "cycle_logs",
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      // 🟢 Giữ lại index tối ưu truy vấn danh sách, xóa bỏ uq_cycle_logs_open
      {
        name: "idx_cycle_logs_user_start",
        fields: ["user_id", "start_date"],
      },
    ],
  },
);

export default CycleLog;