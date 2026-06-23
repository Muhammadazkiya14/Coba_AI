import { Bot, Sparkles } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-white/15 bg-slate-950/70 p-8 shadow-[0_24px_80px_rgba(3,15,30,0.45)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.3),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.2),transparent_30%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Personal Assistant
          </div>
          <h1 className="font-['Fraunces'] text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            pesut.ai
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
            Asisten personal berbasis AI untuk tanya jawab cepat, menyusun ide,
            dan membantu kamu tetap fokus dalam satu ruang percakapan yang tenang.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Bot className="h-4 w-4" />
              Respons natural
            </div>
            <p className="text-slate-300">
              Cocok untuk ngobrol, brainstorming, dan bantu tugas ringan harian.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
