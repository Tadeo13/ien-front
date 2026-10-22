import { useState, useEffect } from "react";
import { Plus, Layers } from "lucide-react";
import { Navigate } from "react-router";
import { adminService } from "../services/admin.service";
import type { GrupoDocument } from "../types/api.types";
import { useAuth } from "../context/AuthContext";
import AdminDialog from "../components/ui/AdminDialog";
import ErrorNotice from "../components/ui/ErrorNotice";
import { useSubmission } from "../hooks/useSubmission";
import { errorMessage } from "../utils/errors";

export default function AdminGrupos() {
  const { user } = useAuth();

  const [grupos, setGrupos] = useState<GrupoDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const { pending: saving, submit } = useSubmission();

  const fetchGrupos = async () => {
    if (user?.rol !== "admin_general") return;
    setLoadError("");
    try {
      const data = await adminService.listarGrupos();
      setGrupos(data);
    } catch (err) {
      setLoadError(errorMessage(err, "No se pudieron cargar los grupos."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGrupos(); }, []);

  const handleSave = () => submit(async () => {
    if (!nombre.trim()) { setError("El nombre es requerido"); return; }
    try {
      await adminService.crearGrupo(nombre.trim());
      setShowForm(false);
      setNombre("");
      setError("");
      await fetchGrupos();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear el grupo");
    }
  });

  if (user?.rol !== "admin_general") return <Navigate to="/admin" replace />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Gestión</p>
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Grupos</h1>
          <p className="text-sm text-muted-foreground mt-1">{grupos.length} grupos registrados</p>
        </div>
        <button
          onClick={() => { setNombre(""); setError(""); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Nuevo grupo
        </button>
      </div>

      {showForm && (
        <AdminDialog title="Nuevo grupo" busy={saving} onClose={() => setShowForm(false)} onSubmit={handleSave}>
            {error && (
              <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive mb-4">{error}</div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="group-name" className="mb-2 block text-xs font-semibold text-foreground">Nombre</label>
                <input
                  id="group-name"
                  required
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="Ej: Grupo Norte"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all">Cancelar</button>
                <button type="submit" disabled={saving || !nombre.trim()} className="flex-1 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-all">{saving ? "Guardando…" : "Crear grupo"}</button>
              </div>
            </div>
        </AdminDialog>
      )}
      {loadError && <ErrorNotice message={loadError} onRetry={fetchGrupos} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {grupos.map((g) => (
          <div key={g._id} className="bg-card rounded-3xl border border-border p-5 hover:shadow-sm transition-shadow">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10 text-accent">
              <Layers size={20} />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{g.nombre}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Creado {(g as any).fecha_creacion ? new Date((g as any).fecha_creacion).toLocaleDateString() : ""}
            </p>
          </div>
        ))}
        {!loadError && grupos.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">No hay grupos registrados</div>
        )}
      </div>
    </div>
  );
}
