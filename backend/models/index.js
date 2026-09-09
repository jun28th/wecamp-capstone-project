import sequelize from "../config/database.js";
import User from "./User.js";
import CycleLog from "./CycleLog.js";
import UserCycleStat from "./UserCycleStat.js";
import DailyLog from "./DailyLog.js";
import Task from "./Task.js";
import DailyReward from "./DailyReward.js";

// --- Associations ---

// users (1) --- (N) cycle_logs
User.hasMany(CycleLog, { foreignKey: "user_id", onDelete: "CASCADE" });
CycleLog.belongsTo(User, { foreignKey: "user_id" });

// users (1) --- (1) user_cycle_stats
User.hasOne(UserCycleStat, { foreignKey: "user_id", onDelete: "CASCADE" });
UserCycleStat.belongsTo(User, { foreignKey: "user_id" });

// users (1) --- (N) daily_logs
User.hasMany(DailyLog, { foreignKey: "user_id", onDelete: "CASCADE" });
DailyLog.belongsTo(User, { foreignKey: "user_id" });

// Note: daily_logs.mood (1-5) is no longer backed by a mood_types table -
// it's just a plain SMALLINT with app-level range validation on the model.

// users (1) --- (N) tasks
User.hasMany(Task, { foreignKey: "user_id", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "user_id" });

// users (1) --- (N) daily_rewards
User.hasMany(DailyReward, { foreignKey: "user_id", onDelete: "CASCADE" });
DailyReward.belongsTo(User, { foreignKey: "user_id" });

export {
  sequelize,
  User,
  CycleLog,
  UserCycleStat,
  DailyLog,
  Task,
  DailyReward,
};
