import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import ChatComposer from "@/components/ChatComposer";
import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import { useChatStore } from "@/store/chatStore";
import { agents, starterPrompts } from "@/utils/chat";
import { Bot, Code, FileText, ImageIcon, MessageSquare } from "lucide-react";

const agentIcons: Record<string, React.ElementType> = {
  MessageSquare,
  Code,
  FileText,
  ImageIcon,
};

export default function Home() {
  const { messages, isLoading, selectedAgent, selectedModel, models, modelsLoaded, setSelectedAgent, setSelectedModel, loadModels, sendMessage, clearChat } = useChatStore();

  useEffect(() => {
    if (!modelsLoaded) {
      void loadModels();
    }
  }, [modelsLoaded, loadModels]);

  const AgentIcon = agentIcons[selectedAgent.icon] ?? Bot;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),linear-gradient(180deg,#03111d_0%,#071a2e_40%,#0b2034_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ChatHeader />

        <section className="grid gap-6 lg:grid-cols-1">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_70px_rgba(3,15,30,0.35)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Ruang Percakapan
                </p>
                <h2 className="mt-2 font-['Fraunces'] text-3xl text-white">
                  Ngobrol santai dengan pesut.ai
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2">
                  <AgentIcon className="h-4 w-4 text-cyan-300" />
                  <select
                    value={selectedAgent.id}
                    onChange={(event) => {
                      const agent = agents.find((a) => a.id === event.target.value);
                      if (agent) setSelectedAgent(agent);
                    }}
                    className="bg-transparent text-sm text-cyan-100 outline-none"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id} className="bg-slate-900 text-white">
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {modelsLoaded && models.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:bg-white/[0.07]"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id} className="bg-slate-900 text-white">
                        {model.name}
                      </option>
                    ))}
                  </select>
                ) : null}

                {isLoading && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Menjawab
                  </div>
                )}
              </div>
            </div>

            <div className="flex h-[540px] flex-col rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col justify-between rounded-[24px] border border-dashed border-cyan-300/20 bg-[linear-gradient(180deg,rgba(6,182,212,0.08),rgba(15,23,42,0.04))] p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                        Siap membantu
                      </p>
                      <h3 className="mt-3 max-w-lg font-['Fraunces'] text-3xl text-white">
                        Mulai percakapan pertamamu dan bentuk gaya assistant yang kamu mau.
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                        Kamu bisa pakai pesut.ai untuk bertanya, merancang ide, menyusun tugas,
                        atau sekadar butuh partner berpikir cepat.
                      </p>
                    </div>

                    <div className="grid gap-3 pt-6">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                )}
              </div>
            </div>

            <ChatComposer
              isLoading={isLoading}
              onSend={sendMessage}
              onReset={clearChat}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
