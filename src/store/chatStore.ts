import { create } from "zustand";
import {
  buildRequestMessages,
  createMessage,
  detectAgent,
  type Agent,
  type ChatMessage,
} from "@/utils/chat";

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  content?: string;
  dataUrl?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string;
  selectedAgent: Agent;
  models: Array<{ id: string; name: string; contextLength: number }>;
  modelsLoaded: boolean;
  setSelectedAgent: (agent: Agent) => void;
  loadModels: () => Promise<void>;
  sendMessage: (content: string, attachments?: FileAttachment[]) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: "",
  selectedAgent: {
    id: "chat",
    name: "Chat Assistant",
    icon: "MessageSquare",
    description: "Asisten chat umum untuk percakapan santai",
    model: "meta-llama/llama-3.1-8b-instruct",
    systemPrompt: "Kamu adalah pesut.ai, personal assistant yang ramah, jelas, dan proaktif. Jawab dalam bahasa Indonesia yang natural, ringkas saat perlu, dan tetap membantu.",
    supportsImage: false,
  },
  models: [],
  modelsLoaded: false,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  loadModels: async () => {
    try {
      const response = await fetch("/api/models");
      const data = (await response.json()) as {
        models?: Array<{ id: string; name: string; contextLength: number }>;
        error?: string;
      };

      if (!response.ok || !data.models) {
        throw new Error(data.error ?? "Gagal memuat daftar model.");
      }

      set({
        models: data.models,
        modelsLoaded: true,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Terjadi gangguan saat memuat daftar model.",
      });
    }
  },
  sendMessage: async (content: string, attachments?: FileAttachment[]) => {
    const trimmed = content.trim();
    const hasAttachments = attachments && attachments.length > 0;

    if (!trimmed && !hasAttachments) {
      return;
    }

    const images = attachments
      ?.filter((f) => f.dataUrl)
      .map((f) => f.dataUrl as string);

    const textParts = attachments
      ?.filter((f) => f.content)
      .map((f) => `[File: ${f.name}]\n${f.content}`)
      .join("\n\n") ?? "";

    const fullContent = [trimmed, textParts].filter(Boolean).join("\n\n").trim() || "Berikut ada lampiran.";

    const hasImages = (images?.length ?? 0) > 0;
    const hasFiles = (attachments?.filter((f) => f.content).length ?? 0) > 0;

    const detectedAgent = detectAgent(fullContent, hasImages, hasFiles, get().selectedAgent.id);

    set({ selectedAgent: detectedAgent });

    const userMessage = createMessage("user", fullContent, images);
    const nextMessages = [...get().messages, userMessage];

    set({
      messages: nextMessages,
      isLoading: true,
      error: "",
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: buildRequestMessages(nextMessages, detectedAgent.systemPrompt),
          model: detectedAgent.model,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Balasan AI tidak tersedia.");
      }

      const reply = data.reply.trim();
      if (reply.includes("Cannot read") && reply.includes("image input")) {
        set((state) => ({
          messages: [...state.messages, createMessage("assistant", reply)],
          isLoading: false,
          error: "",
        }));
        return;
      }

      set((state) => ({
        messages: [...state.messages, createMessage("assistant", reply)],
        isLoading: false,
        error: "",
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi gangguan saat menghubungi pesut.ai.",
      });
    }
  },
  clearChat: () => {
    set({
      messages: [],
      isLoading: false,
      error: "",
    });
  },
}));
