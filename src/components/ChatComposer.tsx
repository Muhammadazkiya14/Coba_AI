import { FormEvent, useState, useRef } from "react";
import { AlertTriangle, FileImage, LoaderCircle, Paperclip, RotateCcw, SendHorizonal, X } from "lucide-react";

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  content?: string;
  dataUrl?: string;
}

interface ChatComposerProps {
  isLoading: boolean;
  onSend: (content: string, attachments?: FileAttachment[]) => Promise<void>;
  onReset: () => void;
  selectedAgentId?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

export default function ChatComposer({
  isLoading,
  onSend,
  onReset,
  selectedAgentId,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [warning, setWarning] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function showWarning(msg: string) {
    setWarning(msg);
    setTimeout(() => setWarning(""), 5000);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    if (attachments.length + files.length > MAX_FILES) {
      showWarning(`Maksimal ${MAX_FILES} file per pesan. Saat ini ada ${attachments.length} file.`);
      event.target.value = "";
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        showWarning(`File "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 5MB per file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (file.type.startsWith("image/")) {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: result as string,
            },
          ]);
        } else {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              size: file.size,
              content: result as string,
            },
          ]);
        }
      };
      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    event.target.value = "";
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitCurrentMessage() {
    const trimmed = message.trim();
    const hasAttachments = attachments.length > 0;

    if (!trimmed && !hasAttachments) {
      return;
    }

    setMessage("");
    setAttachments([]);
    setWarning("");
    await onSend(trimmed, hasAttachments ? attachments : undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitCurrentMessage();
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-slate-950/80 p-4 shadow-[0_24px_60px_rgba(3,15,30,0.35)] backdrop-blur-xl"
    >
      <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-slate-400">
        Tulis pesan
      </label>

      {warning && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
          <span>{warning}</span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
            >
              {file.dataUrl ? (
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <FileImage className="h-4 w-4 text-cyan-300" />
              )}
              <span className="max-w-[120px] truncate">{file.name}</span>
              <span className="text-slate-400">{formatSize(file.size)}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="ml-1 rounded-full p-0.5 text-slate-400 transition hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void submitCurrentMessage();
          }
        }}
        rows={4}
        placeholder={
          selectedAgentId === "image-gen"
            ? "Deskripsi gambar yang ingin dibuat (3D, ilustrasi, dll)..."
            : "Halo pesut.ai, upload file atau foto, atau minta bantu bikin kode..."
        }
        className="min-h-28 w-full resize-none rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.05]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv,.js,.ts,.py,.java,.c,.cpp,.h,.html,.css,.xml,.yaml,.yml"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/5"
          >
            <Paperclip className="h-4 w-4" />
            Upload File
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/5"
          >
            <FileImage className="h-4 w-4" />
            Upload Foto
          </button>

          <p className="text-xs text-slate-500">
            Maks {MAX_FILES} file, {MAX_FILE_SIZE / 1024 / 1024}MB per file
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/70"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <SendHorizonal className="h-4 w-4" />
                Kirim pesan
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
