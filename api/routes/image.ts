import { Router, type Request, type Response } from "express";

const router = Router();

const FALLBACK_IMAGE_MODELS = [
  "black-forest-labs/flux-schnell:free",
  "stabilityai/stable-diffusion-xl:free",
  "google/gemini-2.0-flash-exp:free",
];

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { prompt, model } = req.body as { prompt?: string; model?: string };
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: "OPENROUTER_API_KEY belum diatur. Simpan key baru di file .env lokal atau secret deploy.",
    });
    return;
  }

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({
      error: "Prompt tidak boleh kosong.",
    });
    return;
  }

  const defaultModel = process.env.OPENROUTER_IMAGE_MODEL || FALLBACK_IMAGE_MODELS[0];
  const modelsToTry = [model, defaultModel, ...FALLBACK_IMAGE_MODELS].filter(
    (m, idx, arr) => m && arr.indexOf(m) === idx
  ) as string[];

  let lastError: { status?: number; message?: string } = {};

  for (const imageModel of modelsToTry) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://pesut.ai",
          "X-Title": "pesut.ai",
        },
        body: JSON.stringify({
          model: imageModel,
          prompt: prompt.trim(),
          n: 1,
          size: "1024x1024",
        }),
      });

      const data = (await response.json()) as {
        data?: Array<{ url?: string; b64_json?: string }>;
        error?: { message?: string };
      };

      if (!response.ok) {
        lastError = {
          status: response.status,
          message: data.error?.message ?? `Gagal generate gambar dengan model ${imageModel}.`,
        };
        continue;
      }

      const imageUrl =
        data.data?.[0]?.url ||
        (data.data?.[0]?.b64_json
          ? `data:image/png;base64,${data.data[0].b64_json}`
          : null);

      if (!imageUrl) {
        lastError = {
          status: 502,
          message: `Model ${imageModel} tidak mengembalikan gambar.`,
        };
        continue;
      }

      res.status(200).json({ imageUrl, modelUsed: imageModel });
      return;
    } catch (error) {
      lastError = {
        status: 500,
        message: error instanceof Error ? error.message : "Terjadi error saat memproses generate gambar.",
      };
      continue;
    }
  }

  res.status(lastError.status ?? 500).json({
    error: lastError.message ?? "Semua model gambar gagal. Coba lagi nanti atau gunakan model lain.",
  });
});

export default router;
