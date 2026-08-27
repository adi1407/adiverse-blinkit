import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Loads variables from the .env file into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware = code that runs before your route handlers
app.use(cors()); // allow the React Native app to call this API
app.use(express.json()); // parse JSON bodies from requests

// Health check — useful to confirm the server is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Blinkit clone backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
