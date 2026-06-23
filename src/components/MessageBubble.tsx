import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMessageTime, type ChatMessage } from "@/utils/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-[24px] px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.18)]",
          isUser
            ? "rounded-tr-md bg-cyan-400 text-slate-950"
            : "rounded-tl-md border border-white/10 bg-white/10 text-slate-100 backdrop-blur-sm",
        )}
      >
        {message.images && message.images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {message.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Lampiran ${idx + 1}`}
                className="max-h-64 max-w-full cursor-pointer rounded-xl border border-white/10 object-cover transition hover:opacity-90"
                onClick={() => window.open(img, "_blank")}
              />
            ))}
          </div>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
        )}
        <div
          className={cn(
            "mt-3 text-[11px] uppercase tracking-[0.24em]",
            isUser ? "text-slate-800/70" : "text-slate-400",
          )}
        >
          {formatMessageTime(message.createdAt)}
        </div>
      </div>

      {isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-100">
          <User className="h-4 w-4" />
        </div>
      )}
    </article>
  );
}
