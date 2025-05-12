import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import ordersRoutes from "./routes/orders";
import statsRoutes from "./routes/stats";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stats", statsRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for serverless
export default app;
