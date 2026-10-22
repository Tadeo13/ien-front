import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  PowerOff,
  RotateCcw,
  Store,
  MapPin,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import type { Sucursal } from "../types/api.types";
import { useAuth } from "../context/AuthContext";
import GroupSelect from "../components/ui/GroupSelect";
import { obtenerGrupoId, obtenerNombreGrupo } from "../utils/grupos";
import AdminDialog from "../components/ui/AdminDialog";
import ErrorNotice from "../components/ui/ErrorNotice";
import { useSubmission } from "../hooks/useSubmission";
import { errorMessage } from "../utils/errors";

export default function AdminStores() {
  const { user } = useAuth();
  const isGeneral = user?.rol === 'admin_general';
  const isNegocio = user?.rol === 'admin_negocio';
  const canManage = isGeneral || isNegocio;
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sucursal | null>(null);
  const [form, setForm] = useState({ nombre_tienda: "", ciudad: "", grupo_id: "" });
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const { pending: saving, submit } = useSubmission();

  const fetchStores = async () => {
    setLoadError("");
    try {
      const data = await adminService.listarSucursales(true);
      setStores(data);
    } catch (err) {
      setLoadError(errorMessage(err, "No se pudieron cargar las sucursales."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleSave = () => submit(async () => {
    setError("");
    if (!form.nombre_tienda.trim() || !form.ciudad.trim() || (isGeneral && !form.grupo_id)) { setError("Completa el nombre, la ciudad y el grupo."); return; }
    try {
      if (editing) {
        const body: { nombre_tienda: string; ciudad: string; grupo_id?: string } = {
          nombre_tienda: form.nombre_tienda,
          ciudad: form.ciudad,
        };
        if (isGeneral) body.grupo_id = form.grupo_id;
        await adminService.actualizarSucursal(editing._id, body);
      } else {
        await adminService.crearSucursal({
          nombre_tienda: form.nombre_tienda,
          ciudad: form.ciudad,
          grupo_id: form.grupo_id,
        });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ nombre_tienda: "", ciudad: "", grupo_id: "" });
      await fetchStores();
    } catch (err) {
      setError(errorMessage(err, "No se pudo guardar la sucursal."));
    }
  });

  const handleEdit = (store: Sucursal) => {
    setError("");
    setEditing(store);
    setForm({ nombre_tienda: store.nombre_tienda, ciudad: store.ciudad, grupo_id: obtenerGrupoId(store.grupo_id) ?? "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desactivar esta sucursal?")) return;
    try {
      await adminService.eliminarSucursal(id);
      await fetchStores();
    } catch (err: any) {
      setLoadError(errorMessage(err, "Error al desactivar la sucursal."));
    }
  };

  const handleReactivar = async (id: string) => {
    try {
      await adminService.reactivarSucursal(id);
      await fetchStores();
    } catch (err: any) {
      setLoadError(errorMessage(err, "Error al reactivar la sucursal."));
    }
  };

  const openCreate = () => {
    setError("");
    setEditing(null);
    setForm({ nombre_tienda: "", ciudad: "", grupo_id: "" });
    setShowForm(true);
  };

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
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Sucursales</h1>
          <p className="text-sm text-muted-foreground mt-1">{stores.length} sucursales registradas</p>
        </div>
        {isGeneral && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            Nueva sucursal
          </button>
        )}
      </div>

      {showForm && (
        <AdminDialog title={editing ? "Editar sucursal" : "Nueva sucursal"} busy={saving} onClose={() => setShowForm(false)} onSubmit={handleSave}>
            {error && <ErrorNotice message={error} />}
            <div className="space-y-4">
              <div>
                <label htmlFor="store-name" className="mb-2 block text-xs font-semibold text-foreground">Nombre</label>
                <input
                  id="store-name"
                  required
                  type="text"
                  value={form.nombre_tienda}
                  onChange={(e) => setForm({ ...form, nombre_tienda: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="Nombre de la sucursal"
                />
              </div>
              <div>
                <label htmlFor="store-city" className="mb-2 block text-xs font-semibold text-foreground">Ciudad</label>
                <input
                  id="store-city"
                  required
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="Ciudad"
                />
              </div>
              {isGeneral && (
                <div>
                  <label htmlFor="store-group" className="mb-2 block text-xs font-semibold text-foreground">Grupo</label>
                  <GroupSelect
                    id="store-group"
                    value={form.grupo_id}
                    onChange={(grupoId) => setForm({ ...form, grupo_id: grupoId })}
                    required
                  />
                </div>
              )}
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all">Cancelar</button>
                <button type="submit" disabled={saving || !form.nombre_tienda.trim() || !form.ciudad.trim() || (isGeneral && !form.grupo_id)} className="flex-1 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-all">
                  {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear sucursal"}
                </button>
              </div>
            </div>
        </AdminDialog>
      )}
      {loadError && <ErrorNotice message={loadError} onRetry={fetchStores} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div key={store._id} className="bg-card rounded-3xl border border-border p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10 text-accent">
                <Store size={20} />
              </div>
              <div className="flex items-center gap-1">
                {canManage && (
                  <button aria-label={`Editar ${store.nombre_tienda}`} onClick={() => handleEdit(store)} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
                    <Edit3 size={14} />
                  </button>
                )}
                {canManage && store.activo && (
                  <button aria-label={`Desactivar ${store.nombre_tienda}`} onClick={() => handleDelete(store._id)} className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                    <PowerOff size={14} />
                  </button>
                )}
                {canManage && !store.activo && (
                  <button aria-label={`Reactivar ${store.nombre_tienda}`} onClick={() => handleReactivar(store._id)} className="p-2 rounded-xl text-muted-foreground hover:bg-accent/10 hover:text-accent transition-all">
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            </div>
            <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${store.activo ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${store.activo ? 'bg-accent' : 'bg-destructive'}`} />
              {store.activo ? 'Activa' : 'Inactiva'}
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{store.nombre_tienda}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              {store.ciudad}
            </div>
            {obtenerNombreGrupo(store.grupo_id) && (
              <span className="mt-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                {obtenerNombreGrupo(store.grupo_id)}
              </span>
            )}
          </div>
        ))}
        {!loadError && stores.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No hay sucursales registradas
          </div>
        )}
      </div>
    </div>
  );
}
