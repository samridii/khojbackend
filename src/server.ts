import dotenv from "dotenv";

dotenv.config();

console.log("MONGO:", process.env.MONGO_URI);

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 KHOJ API running on http://localhost:${PORT}`);
    console.log(`📖 Swagger docs at http://localhost:${PORT}/api/docs`);
  });
};

startServer();