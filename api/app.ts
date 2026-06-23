import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import chatRoutes from "./routes/chat.js";
import modelsRoutes from "./routes/models.js";

dotenv.config();

const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/chat", chatRoutes);
app.use("/api/models", modelsRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "API tidak ditemukan.",
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  void req;
  void next;
  res.status(500).json({
    error: error.message || "Server internal error.",
  });
});

export default app;
