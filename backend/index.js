import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import { ensureDefaultUser } from "./config/defaultUser.js";
import userRoutes from "./routes/user.routes.js";
import dailyLogRoutes from "./routes/dailyLog.routes.js"
import taskRoutes from "./routes/task.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import cycleLogRoute from "./routes/cycleLog.routes.js"
import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dailyLog", dailyLogRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/cycle-logs", cycleLogRoute)

app.get("/api", (req, res) => {
  res.send("Backend đang chạy!");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync(); 
    await ensureDefaultUser(); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
