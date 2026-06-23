import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";
import modelsRoutes from "./routes/models.js";
import imageRoutes from "./routes/image.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
}

app.get("/api/health", (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/chat", chatRoutes);
app.use("/api/models", modelsRoutes);
app.use("/api/generate-image", imageRoutes);

app.use("/api", (_req: Request, res: Response): void => {
  res.status(404).json({
    error: "API tidak ditemukan.",
  });
});

if (process.env.NODE_ENV === "production") {
  app.get("*", (_req: Request, res: Response): void => {
    const distPath = path.join(__dirname, "..", "dist");
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  void req;
  void next;
  res.status(500).json({
    error: error.message || "Server internal error.",
  });
});

export default app;
