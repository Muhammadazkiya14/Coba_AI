import { Router, type Request, type Response } from "express";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatBody {
  messages?: OpenRouterMessage[];
  model?: string;
}

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { messages, model } = req.body as ChatBody;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const selectedModel =
    model && model.length > 0
      ? model
      : process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct";

  if (!apiKey) {
    res.status(500).json({
      error:
        "OPENROUTER_API_KEY belum diatur. Simpan key baru di file .env lokal atau secret deploy.",
    });
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({
      error: "Pesan percakapan tidak valid.",
    });
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pesut.ai",
        "X-Title": "pesut.ai",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature: 0.8,
        max_tokens: 700,
      }),
    });

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      res.status(response.status).json({
        error: data.error?.message ?? "Permintaan ke OpenRouter gagal.",
      });
      return;
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      res.status(502).json({
        error: "OpenRouter tidak mengembalikan balasan yang bisa dipakai.",
      });
      return;
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Terjadi error saat memproses permintaan AI.",
    });
  }
});

export default router;
