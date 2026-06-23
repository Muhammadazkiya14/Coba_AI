import { describe, expect, it } from "vitest";
import { agents } from "@/utils/chat";
import { buildRequestMessages, createMessage } from "@/utils/chat";

describe("chat utils", () => {
  it("menambahkan system prompt di awal payload", () => {
    const messages = [createMessage("user", "Halo pesut.ai")];
    const payload = buildRequestMessages(messages, agents[0].systemPrompt);

    expect(payload[0].role).toBe("system");
    expect(payload[1]).toMatchObject({
      role: "user",
      content: "Halo pesut.ai",
    });
  });

  it("membatasi history ke 12 pesan terakhir", () => {
    const messages = Array.from({ length: 14 }, (_, index) =>
      createMessage("user", `Pesan ${index + 1}`),
    );

    const payload = buildRequestMessages(messages, agents[0].systemPrompt);

    expect(payload).toHaveLength(13);
    expect(payload[1].content).toBe("Pesan 3");
    expect(payload.at(-1)?.content).toBe("Pesan 14");
  });

  it("detect coding agent untuk pertanyaan tentang kode", () => {
    const agent = agents.find((a) => a.id === "coding");
    expect(agent).toBeDefined();
    expect(agent?.supportsImage).toBe(false);
  });

  it("detect document agent untuk file upload", () => {
    const agent = agents.find((a) => a.id === "document");
    expect(agent).toBeDefined();
    expect(agent?.supportsImage).toBe(true);
  });
});
