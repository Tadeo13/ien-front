import { useState, useEffect, type ReactNode } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import TimePicker from "../components/ui/TimePicker";

function formatHora(hora: number, minuto: number) {
  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

function CollapsibleCard({
  eyebrow,
  title,
  subtitle,
  collapsedHint,
  defaultOpen = true,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  collapsedHint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-secondary/40"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">{eyebrow}</p>
          <p className="font-['Lora'] text-lg font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {!open && collapsedHint && (
            <p className="mt-2 text-xs font-medium text-primary">{collapsedHint}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export default function Cuenta() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [reminderHour, setReminderHour] = useState(10);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [reminderLoading, setReminderLoading] = useState(true);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderSuccess, setReminderSuccess] = useState(false);
  const [reminderError, setReminderError] = useState("");

  useEffect(() => {
    let active = true;
    authService.getProfile()
      .then((profile) => {
        if (!active) return;
        setReminderHour(typeof profile.hora_recordatorio === "number" ? profile.hora_recordatorio : 10);
        setReminderMinute(typeof profile.minuto_recordatorio === "number" ? profile.minuto_recordatorio : 0);
      })
      .catch(() => {})
      .finally(() => { if (active) setReminderLoading(false); });
    return () => { active = false; };
  }, []);

  const handleSaveReminder = async () => {
    setReminderSaving(true);
    setReminderError("");
    setReminderSuccess(false);
    try {
      await authService.updateReminderSchedule(reminderHour, reminderMinute);
      setReminderSuccess(true);
    } catch (err: any) {
      setReminderError(err.response?.data?.error || "Error al guardar el horario.");
    } finally {
      setReminderSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Completá todos los campos.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Volver al dashboard
      </button>

      {/* Profile info */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10">
            <Shield size={22} className="text-primary" />
          </div>
          <div>
            <p className="font-['Lora'] text-lg font-semibold text-foreground">{user?.nombre}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Reminder schedule */}
      <CollapsibleCard
        eyebrow="Recordatorios"
        title="Horario del recordatorio diario"
        subtitle="Te enviamos un correo a esta hora cuando tenés un día pendiente del programa."
        collapsedHint={reminderLoading ? undefined : `Recordatorio a las ${formatHora(reminderHour, reminderMinute)}`}
      >
        {reminderLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          </div>
        ) : (
          <>
            <TimePicker
              hora={reminderHour}
              minuto={reminderMinute}
              onChange={({ hora, minuto }) => {
                setReminderHour(hora);
                setReminderMinute(minuto);
                setReminderSuccess(false);
              }}
              disabled={reminderSaving}
            />

            {reminderSuccess && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-accent">
                <CheckCircle size={13} />
                Horario actualizado
              </p>
            )}
            {reminderError && (
              <p className="mt-2 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {reminderError}
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveReminder}
              disabled={reminderSaving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reminderSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Guardar horario"
              )}
            </button>
          </>
        )}
      </CollapsibleCard>

      {/* Change password */}
      <CollapsibleCard
        eyebrow="Seguridad"
        title="Cambiar contraseña"
        collapsedHint={success ? "Contraseña actualizada" : undefined}
      >
        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle size={28} className="text-accent" />
            </div>
            <p className="text-sm font-semibold text-foreground">Contraseña actualizada</p>
            <p className="text-xs text-muted-foreground mt-1">Todas las sesiones anteriores fueron cerradas.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 px-5 py-2.5 rounded-xl text-xs font-semibold text-background bg-foreground transition-all hover:opacity-90"
            >
              Volver al dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Contraseña actual
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Nueva contraseña
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Guardar nueva contraseña"
              )}
            </button>
          </form>
        )}
      </CollapsibleCard>
    </div>
  );
}
