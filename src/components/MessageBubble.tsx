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
        "flex gap-3.5 items-start",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* Message Content Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-[20px] px-5 py-3.5 shadow-lg transition-all duration-300 hover:shadow-xl",
          isUser
            ? "rounded-tr-sm bg-gradient-to-tr from-cyan-400 to-cyan-300 text-slate-950 shadow-cyan-500/5"
            : "rounded-tl-sm border border-white/[0.06] bg-slate-900/65 text-slate-100 backdrop-blur-md"
        )}
      >
        {/* Render Attachments/Images */}
        {message.images && message.images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {message.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Lampiran ${idx + 1}`}
                className="max-h-60 max-w-full cursor-pointer rounded-xl border border-white/10 object-cover transition hover:opacity-90 hover:scale-[1.01]"
                onClick={() => window.open(img, "_blank")}
              />
            ))}
          </div>
        )}

        {/* Text Content */}
        {message.content && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed tracking-wide font-normal">
            {message.content}
          </p>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            "mt-2 text-[10px] uppercase tracking-wider font-medium opacity-60",
            isUser ? "text-slate-800" : "text-cyan-200/70"
          )}
        >
          {formatMessageTime(message.createdAt)}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-cyan-300 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
          <User className="h-4 w-4" />
        </div>
      )}
    </article>
  );
}
