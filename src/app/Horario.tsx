import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowRight, ChevronLeft, Loader2, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import Footer from "../components/layout/Footer";
import TimePicker from "../components/ui/TimePicker";

export default function Horario() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const regData = (location.state as {
    nombre?: string;
    email?: string;
    password?: string;
    codigo_activacion?: string;
  }) || {};

  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!(regData.nombre && regData.email && regData.password && regData.codigo_activacion);

  useEffect(() => {
    if (canSubmit || submitting) return;
    navigate(regData.codigo_activacion ? "/register" : "/activar", {
      replace: true,
      state: regData.codigo_activacion ? { codigo_activacion: regData.codigo_activacion } : undefined,
    });
  }, [canSubmit, submitting, navigate, regData.codigo_activacion]);

  const handleSkip = () => {
    setHour(10);
    setMinute(0);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const payload: Record<string, any> = {
        nombre: regData.nombre,
        email: regData.email,
        password: regData.password,
        codigo_activacion: regData.codigo_activacion,
        hora_recordatorio: hour,
        minuto_recordatorio: minute,
      };
      await register(payload);
      navigate("/bienvenida");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear la cuenta.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/register", { state: { codigo_activacion: regData.codigo_activacion } })} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <img src="/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] flex items-center justify-center font-bold">3</span>
            Horario
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="max-w-lg w-full">

          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Paso 3 de 3</p>
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Elegí tu horario</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Recibirás tu recordatorio diario a esta hora cuando tengas un día pendiente.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 mb-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                <Clock size={15} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Hora del recordatorio</p>
            </div>

            <TimePicker
              hora={hour}
              minuto={minute}
              onChange={({ hora, minuto }) => { setHour(hora); setMinute(minuto); }}
              disabled={submitting}
            />
          </div>

          {/* Sin preferencia */}
          <button
            onClick={handleSkip}
            className="w-full mb-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-border bg-card hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            Sin preferencia (10:00 AM)
          </button>

          {/* Submit */}
          <button
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Comenzar el programa
                <ArrowRight size={16} />
              </>
            )}
          </button>
          {error && (
            <p className="text-center text-xs font-medium text-destructive mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
