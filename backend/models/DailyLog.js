import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class DailyLog extends Model {}
DailyLog.init(
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
    logDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "log_date",
    },
    mood: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isFinalized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_finalized",
    },
  },
  {
    sequelize,
    modelName: "DailyLog",
    tableName: "daily_logs",
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
      // mirrors chk_mood_or_note: mood IS NOT NULL OR note IS NOT NULL
      moodOrNote() {
        if (this.mood === null && !this.note) {
          throw new Error("daily_logs requires mood or note to be set");
        }
      },
    },
    indexes: [
      {
        name: "uq_daily_logs_user_date",
        unique: true,
        fields: ["user_id", "log_date"],
      },
    ],
  },
);

export default DailyLog;
