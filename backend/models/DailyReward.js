import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class DailyReward extends Model {}
DailyReward.init(
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
    rewardDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "reward_date",
    },
    rewardText: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "reward_text",
    },
    isUnlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_unlocked",
    },
    unlockedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "unlocked_at",
    },
  },
  {
    sequelize,
    modelName: "DailyReward",
    tableName: "daily_rewards",
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "uq_daily_rewards_user_date",
        unique: true,
        fields: ["user_id", "reward_date"],
      },
    ],
  },
);

export default DailyReward;
