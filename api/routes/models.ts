import { Router, type Request, type Response } from "express";

interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: {
    is_moderated: boolean;
  };
  architecture?: {
    modality?: string;
  };
}

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error:
        "OPENROUTER_API_KEY belum diatur. Simpan key baru di file .env lokal atau secret deploy.",
    });
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: "Gagal mengambil daftar model dari OpenRouter.",
      });
      return;
    }

    const data = (await response.json()) as { data: OpenRouterModel[] };

    const chatModels = data.data
      .filter((model) => {
        if (!model.id || model.id.includes("rerank") || model.id.includes("re-rank")) {
          return false;
        }
        const modality = model.architecture?.modality?.toLowerCase() ?? "";
        if (modality.includes("image") && !modality.includes("text+image")) {
          return false;
        }
        return true;
      })
      .map((model) => ({
        id: model.id,
        name: model.name,
        contextLength: model.context_length,
        pricing: {
          prompt: model.pricing.prompt,
          completion: model.pricing.completion,
        },
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({ models: chatModels });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Terjadi error saat mengambil daftar model.",
    });
  }
});

router.get("/image", async (_req: Request, res: Response): Promise<void> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error:
        "OPENROUTER_API_KEY belum diatur. Simpan key baru di file .env lokal atau secret deploy.",
    });
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: "Gagal mengambil daftar model dari OpenRouter.",
      });
      return;
    }

    const data = (await response.json()) as { data: OpenRouterModel[] };

    const imageModels = data.data
      .filter((model) => {
        if (!model.id) return false;
        const id = model.id.toLowerCase();
        const modality = (model.architecture?.modality ?? "").toLowerCase();
        return (
          id.includes("image") ||
          id.includes("flux") ||
          id.includes("stable-diffusion") ||
          id.includes("dall-e") ||
          id.includes("midjourney") ||
          modality.includes("image")
        );
      })
      .map((model) => ({
        id: model.id,
        name: model.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({ models: imageModels });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Terjadi error saat mengambil daftar model gambar.",
    });
  }
});

export default router;
