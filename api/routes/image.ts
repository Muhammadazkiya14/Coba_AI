import { Router, type Request, type Response } from "express";

const router = Router();

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

  const imageModel =
    model || process.env.OPENROUTER_IMAGE_MODEL || "black-forest-labs/flux-schnell:free";

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
      res.status(response.status).json({
        error: data.error?.message ?? "Gagal generate gambar.",
      });
      return;
    }

    const imageUrl =
      data.data?.[0]?.url ||
      (data.data?.[0]?.b64_json
        ? `data:image/png;base64,${data.data[0].b64_json}`
        : null);

    if (!imageUrl) {
      res.status(502).json({
        error: "OpenRouter tidak mengembalikan gambar.",
      });
      return;
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Terjadi error saat memproses generate gambar.",
    });
  }
});

export default router;
