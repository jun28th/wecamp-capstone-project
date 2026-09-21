import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class UserCycleStat extends Model {}
UserCycleStat.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "user_id",
    },
    completedCycleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "completed_cycle_count",
    },
    avgCycleLengthDays: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "avg_cycle_length_days",
    },
    avgPeriodLengthDays: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "avg_period_length_days",
    },
    cycleLengthStddev: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "cycle_length_stddev",
    },
    predictedNextStart: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "predicted_next_start",
    },
    lastCalculatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_calculated_at",
    },
  },
  {
    sequelize,
    modelName: "UserCycleStat",
    tableName: "user_cycle_stats",
    timestamps: false,
  },
);

export default UserCycleStat;
