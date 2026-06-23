export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Exclude<ChatRole, "system">;
  content: string;
  createdAt: string;
  images?: string[];
}

export interface ApiChatMessage {
  role: ChatRole;
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
}

export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  supportsImage: boolean;
}

export const agents: Agent[] = [
  {
    id: "chat",
    name: "Chat Assistant",
    icon: "MessageSquare",
    description: "Asisten chat umum untuk percakapan santai",
    systemPrompt: "Kamu adalah pesut.ai, personal assistant yang ramah, jelas, dan proaktif. Jawab dalam bahasa Indonesia yang natural, ringkas saat perlu, dan tetap membantu.",
    supportsImage: false,
  },
  {
    id: "coding",
    name: "Coding Assistant",
    icon: "Code",
    description: "Expert programmer untuk bantuan koding",
    systemPrompt: "Kamu adalah expert programmer yang ahli dalam banyak bahasa pemrograman. Berikan kode yang bersih, efisien, dan well-documented. Gunakan bahasa Indonesia untuk penjelasan, tapi kode tetap dalam bahasa Inggris. Selalu sertakan contoh penggunaan jika memungkinkan.",
    supportsImage: false,
  },
  {
    id: "document",
    name: "Document Analyst",
    icon: "FileText",
    description: "Analisis dan ekstrak info dari dokumen teks atau gambar",
    systemPrompt: "Kamu adalah analyst dokumen profesional. Baca, ringkas, ekstrak informasi penting, dan berikan insight dari dokumen yang diberikan. Jawab dalam bahasa Indonesia yang jelas dan terstruktur.",
    supportsImage: true,
  },
  {
    id: "image",
    name: "Image Analyst",
    icon: "Image",
    description: "Analisis dan deskripsi gambar",
    systemPrompt: "Kamu adalah vision AI yang bisa menganalisis gambar. Jelaskan apa yang ada di gambar, identifikasi objek, teks, dan konteks. Jawab dalam bahasa Indonesia yang detail dan akurat.",
    supportsImage: true,
  },
];

export const starterPrompts = [
  "Bantu aku menyusun to-do list hari ini.",
  "Kasih ide caption singkat untuk Instagram.",
  "Temani aku brainstorming nama usaha kecil.",
];

export function createMessage(
  role: ChatMessage["role"],
  content: string,
  images?: string[],
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    images,
  };
}

export function buildRequestMessages(
  messages: ChatMessage[],
  systemPrompt: string,
): ApiChatMessage[] {
  const systemMessage: ApiChatMessage = {
    role: "system",
    content: systemPrompt,
  };

  const conversation = messages
    .filter((message) => message.content.trim().length > 0 || (message.images && message.images.length > 0))
    .slice(-12)
    .map<ApiChatMessage>((message) => {
      if (message.images && message.images.length > 0) {
        const textPart = { type: "text" as const, text: message.content.trim() };
        const imageParts = message.images.map((img) => ({
          type: "image_url" as const,
          image_url: { url: img },
        }));
        return {
          role: message.role,
          content: [textPart, ...imageParts],
        };
      }
      return {
        role: message.role,
        content: message.content.trim(),
      };
    });

  return [systemMessage, ...conversation];
}

export function detectAgent(
  content: string,
  hasImages: boolean,
  hasFiles: boolean,
  manualAgentId?: string,
): Agent {
  if (manualAgentId) {
    const manualAgent = agents.find((a) => a.id === manualAgentId);
    if (manualAgent) return manualAgent;
  }

  if (hasImages && !hasFiles) {
    const imageAgent = agents.find((a) => a.id === "image");
    if (imageAgent) return imageAgent;
  }

  if (hasFiles && !hasImages) {
    const docAgent = agents.find((a) => a.id === "document");
    if (docAgent) return docAgent;
  }

  if (hasImages && hasFiles) {
    const docAgent = agents.find((a) => a.id === "document");
    if (docAgent) return docAgent;
  }

  const chatAgent = agents.find((a) => a.id === "chat");
  return chatAgent ?? agents[0];
}

export function formatMessageTime(isoDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
