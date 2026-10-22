import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { GrupoDocument } from "../../types/api.types";

interface GroupSelectProps {
  id?: string;
  value: string;
  onChange: (grupoId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function GroupSelect({ id, value, onChange, disabled, required }: GroupSelectProps) {
  const [grupos, setGrupos] = useState<GrupoDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    adminService
      .listarGrupos()
      .then(setGrupos)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [retry]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        Cargando grupos...
      </div>
    );
  }

  return (
    <>
    <select
      id={id}
      aria-label={id ? undefined : "Grupo"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || error}
      required={required}
      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
    >
      <option value="">Seleccionar grupo</option>
      {grupos.map((g) => (
        <option key={g._id} value={g._id}>{g.nombre}</option>
      ))}
    </select>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">No se pudieron cargar los grupos. <button type="button" onClick={() => setRetry(n => n + 1)} className="underline">Reintentar</button></p>}
    </>
  );
}
