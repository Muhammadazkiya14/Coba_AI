import { LoaderCircle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import ChatComposer from "@/components/ChatComposer";
import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import { useChatStore } from "@/store/chatStore";
import { starterPrompts } from "@/utils/chat";

export default function Home() {
  const {
    messages,
    isLoading,
    error,
    loadModels,
    loadImageModels,
    sendMessage,
    clearChat,
  } = useChatStore();

  useEffect(() => {
    void loadModels();
    void loadImageModels();
  }, [loadModels, loadImageModels]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_50%),linear-gradient(180deg,#020712_0%,#040d1e_50%,#06132b_100%)] flex items-center justify-center p-4 text-white sm:p-6 lg:p-8">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-[32px] border border-white/10 bg-slate-950/40 shadow-[0_0_80px_-10px_rgba(6,182,212,0.15),0_30px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden">
        {/* Sleek Top Bar (Integrated ChatHeader) */}
        <ChatHeader />

        {/* Scrollable Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[400px] flex-col justify-between py-6">
              {/* Branding Header */}
              <div className="text-center max-w-lg mx-auto mt-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200 mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Assistant Aktif
                </div>
                <h2 className="font-['Fraunces'] text-4xl font-semibold tracking-tight text-white mb-4">
                  Ngobrol dengan pesut.ai
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Asisten personal berbasis AI untuk bantu menyusun ide, koding, analisis dokumen,
                  atau sekadar teman bertukar pikiran yang siap sedia kapan saja.
                </p>
              </div>

              {/* Starter Prompts */}
              <div className="grid gap-3 pt-8 sm:grid-cols-3 max-w-3xl mx-auto w-full">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left text-sm text-slate-300 transition hover:border-cyan-300/35 hover:bg-white/[0.05] hover:text-white group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  >
                    <span>{prompt}</span>
                    <span className="mt-4 text-xs text-cyan-400/70 group-hover:text-cyan-300 transition">
                      Tanyakan →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                    <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
                  </div>
                  <span className="text-xs tracking-wider uppercase text-cyan-300/80 animate-pulse">
                    pesut.ai sedang mengetik...
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.05)] mt-4">
              <p className="font-semibold mb-1">⚠️ Gagal terhubung ke AI:</p>
              <p className="opacity-90 text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Bottom Composer */}
        <div className="border-t border-white/5 bg-slate-950/25 p-4 sm:p-6">
          <ChatComposer
            isLoading={isLoading}
            onSend={sendMessage}
            onReset={clearChat}
          />
        </div>
      </div>
    </main>
  );
}
