import sequelize from "../config/database.js";
import { Model, DataTypes } from "sequelize";

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "display_name",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    // created_at / updated_at columns are handled by Sequelize timestamps below
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default User;
