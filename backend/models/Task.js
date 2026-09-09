import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class Task extends Model {}
Task.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "due_date",
    },
    priority: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "normal",
      validate: {
        isIn: [["normal", "urgent"]],
      },
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_completed",
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "completed_at",
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_tasks_user_due",
        fields: ["user_id", "due_date"],
      },
      {
        name: "idx_tasks_user_priority",
        fields: ["user_id", "priority", "is_completed"],
      },
    ],
  },
);

export default Task;
