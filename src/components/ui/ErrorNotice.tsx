import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle size={18} className="shrink-0" />
      <p className="min-w-0 flex-1">{message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-current px-3 py-2 font-semibold"><RotateCcw size={14} />Reintentar</button>}
    </div>
  );
}
