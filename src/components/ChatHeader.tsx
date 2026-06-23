import { Cpu, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export default function ChatHeader() {
  const { models, selectedModel, setSelectedModel, selectedAgent } = useChatStore();

  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/45 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
          </span>
          <h1 className="font-['Fraunces'] text-2xl font-semibold tracking-tight text-white">
            pesut.ai
          </h1>
        </div>
        <div className="h-4 w-[1px] bg-white/20" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-200">
          <Sparkles className="h-3 w-3" />
          {selectedAgent.name}
        </span>
      </div>

      {/* Model Selection Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="model-select" className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <Cpu className="h-3.5 w-3.5 text-cyan-300" />
          Model:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-white outline-none transition focus:border-cyan-300/40"
        >
          {models.length === 0 ? (
            <option value="">Memuat model...</option>
          ) : (
            models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))
          )}
        </select>
      </div>
    </header>
  );
}
