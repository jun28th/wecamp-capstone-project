import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import { ensureDefaultUser } from "./config/defaultUser.js";
import userRoutes from "./routes/user.routes.js";
import dailyLogRoutes from "./routes/dailyLog.routes.js"
import taskRoutes from "./routes/task.routes.js";
import cycleLogRoute from "./routes/cycleLog.routes.js"
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dailyLog", dailyLogRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/cycle-logs", cycleLogRoute)
// const express = require('express');
// const cors = require('cors');
// const itemRoutes = require('./routes/item.routes');
// const errorHandler = require('./middlewares/errorHandler');

// const app = express();
// app.use(cors());
// app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Backend đang chạy!");
});

// app.use('/api/items', itemRoutes);

// app.use(errorHandler);
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync(); // Creates all 6 tables (users, cycle_logs, user_cycle_stats, daily_logs, tasks, daily_rewards) if they don't exist
    await ensureDefaultUser(); // Temporary: owns all tasks until real auth/login exists
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Khởi chạy server
startServer();
