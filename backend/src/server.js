import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import catalogRoutes from "./routes/catalogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Blinkit clone backend is running",
  });
});

app.use("/api", catalogRoutes);
app.use("/api", orderRoutes);

// 0.0.0.0 = reachable from phone on same Wi‑Fi (not only this PC)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Phone / Expo Go: use http://<YOUR_PC_IP>:${PORT}`);
});
