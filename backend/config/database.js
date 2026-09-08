import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "my_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "123";
const DB_HOST = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
