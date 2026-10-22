import { useState, useMemo } from "react";
import { Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_TEMPLATES } from "../emails/index";

export default function AdminEmails() {
  const [selected, setSelected] = useState(0);
  const [previewName, setPreviewName] = useState("María García");

  const tpl = ALL_TEMPLATES[selected];

  const html = useMemo(() => tpl.render(previewName), [tpl, previewName]);

  const prev = () => setSelected((s) => (s === 0 ? ALL_TEMPLATES.length - 1 : s - 1));
  const next = () => setSelected((s) => (s === ALL_TEMPLATES.length - 1 ? 0 : s + 1));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sistema</p>
        <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Plantillas de correo</h1>
        <p className="text-sm text-muted-foreground mt-1">{ALL_TEMPLATES.length} plantillas de email transaccionales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar list */}
        <div className="lg:col-span-3 space-y-2">
          {ALL_TEMPLATES.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                i === selected
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              }`}
            >
              <Mail size={16} className={i === selected ? "text-accent" : "text-muted-foreground"} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:col-span-9">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 border-b border-border">
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <button aria-label="Plantilla anterior" onClick={prev} className="shrink-0 rounded-xl border border-border p-2 hover:bg-secondary transition-all">
                  <ChevronLeft size={16} className="text-muted-foreground" />
                </button>
                <div className="min-w-0 text-center">
                  <p className="text-sm font-semibold text-foreground">{tpl.label}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{tpl.key}</p>
                </div>
                <button aria-label="Plantilla siguiente" onClick={next} className="shrink-0 rounded-xl border border-border p-2 hover:bg-secondary transition-all">
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <label htmlFor="preview-name" className="text-xs font-semibold text-muted-foreground">Nombre de ejemplo</label>
                <input
                  id="preview-name"
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 sm:w-48"
                />
              </div>
            </div>

            {/* Iframe preview */}
            <div className="p-4 bg-secondary/30">
              <div className="rounded-2xl overflow-hidden border border-border bg-white" style={{ height: "70vh" }}>
                <iframe
                  srcDoc={html}
                  title="Email preview"
                  className="w-full h-full border-0"
                  sandbox=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
