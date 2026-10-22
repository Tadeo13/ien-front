import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  title: string;
  children: ReactNode;
  busy?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function AdminDialog({ title, children, busy = false, onClose, onSubmit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)")?.focus();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-busy={busy}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/40"
      onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={titleId} className="font-['Lora'] text-lg font-semibold">{title}</h2>
          <button type="button" disabled={busy} aria-label="Cerrar formulario" onClick={onClose} className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary disabled:opacity-40"><X size={18} /></button>
        </div>
        <form onSubmit={event => { event.preventDefault(); if (!busy) onSubmit(); }}>
          <fieldset disabled={busy} className="min-w-0 space-y-4">{children}</fieldset>
        </form>
      </div>
    </dialog>
  );
}
