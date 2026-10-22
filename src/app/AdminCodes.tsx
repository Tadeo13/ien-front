import { useState, useEffect } from "react";
import { Plus, Power, PowerOff, QrCode, KeyRound } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { CodigoActivacion, Sucursal, ProductoAdmin } from "../types/api.types";
import CodeInput from "../components/CodeInput";
import { obtenerGrupoId } from "../utils/grupos";
import AdminDialog from "../components/ui/AdminDialog";
import ErrorNotice from "../components/ui/ErrorNotice";
import { useSubmission } from "../hooks/useSubmission";
import { errorMessage } from "../utils/errors";

export default function AdminCodes() {
  const [codes, setCodes] = useState<CodigoActivacion[]>([]);
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [codeKey, setCodeKey] = useState(0);
  const [form, setForm] = useState({ codigo: "", producto_id: "", tienda_id: "" });
  const [loadError, setLoadError] = useState("");
  const { pending: saving, submit } = useSubmission();
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchData = async () => {
    setLoadError("");
    try {
      const [c, s, p] = await Promise.allSettled([
        adminService.listarCodigos(),
        adminService.listarSucursales(),
        adminService.listarProductos(),
      ]);
      setCodes(c.status === "fulfilled" ? c.value : []);
      setStores(s.status === "fulfilled" ? s.value : []);
      setProducts(p.status === "fulfilled" ? p.value : []);
      if ([c, s, p].some(result => result.status === "rejected")) setLoadError("No se pudieron cargar todos los datos. Reintenta antes de crear un código.");
    } catch (err) {
      console.error("Error fetching codes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = () => submit(async () => {
    setError("");
    try {
      await adminService.crearCodigo(form);
      setShowForm(false);
      setForm({ codigo: "", producto_id: "", tienda_id: "" });
      setError("");
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear el código");
    }
  });

  const toggleCode = async (code: CodigoActivacion) => {
    if (toggling) return;
    setToggling(code._id);
    try {
      if (code.activo) {
        await adminService.desactivarCodigo(code._id);
      } else {
        await adminService.activarCodigo(code._id);
      }
      await fetchData();
    } catch (err) {
      setLoadError(errorMessage(err, "No se pudo cambiar el estado del código."));
    } finally {
      setToggling(null);
    }
  };

  const getTiendaNombre = (code: CodigoActivacion) => {
    const t = code.tienda_id;
    return typeof t === "object" && t !== null ? t.nombre_tienda : "—";
  };

  const getProductoNombre = (code: CodigoActivacion) => {
    const p = code.producto_id;
    return typeof p === "object" && p !== null ? p.nombre : "—";
  };

  const activos = codes.filter((c) => c.activo).length;

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
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Códigos de activación</h1>
          <p className="text-sm text-muted-foreground mt-1">{codes.length} códigos · {activos} activos</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); setCodeKey((k) => k + 1); }}
          className="flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Nuevo código
        </button>
      </div>

      {showForm && (
        <AdminDialog title="Nuevo código de activación" busy={saving} onClose={() => setShowForm(false)} onSubmit={handleSave}>
            {error && (
              <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive mb-4">{error}</div>
            )}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Código</label>
                <CodeInput
                  key={codeKey}
                  onChange={(v) => { setForm({ ...form, codigo: v }); setError(""); }}
                />
                <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="font-mono font-bold">ABC</span> letras</span>
                  <span className="text-border">-</span>
                  <span className="flex items-center gap-1"><span className="font-mono font-bold">123</span> números</span>
                </div>
              </div>
              <div>
                <label htmlFor="code-store" className="mb-2 block text-xs font-semibold text-foreground">Sucursal</label>
                <select
                  id="code-store"
                  required
                  value={form.tienda_id}
                  onChange={(e) => setForm({ ...form, tienda_id: e.target.value, producto_id: "" })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                >
                  <option value="">Seleccionar sucursal</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>{s.nombre_tienda}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="code-product" className="mb-2 block text-xs font-semibold text-foreground">Producto</label>
                <select
                  id="code-product"
                  required
                  value={form.producto_id}
                  onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                >
                  <option value="">Seleccionar producto</option>
                  {products.filter((p) => {
                    const tiendaSel = stores.find((s) => s._id === form.tienda_id);
                    const grupoTienda = obtenerGrupoId(tiendaSel?.grupo_id);
                    return obtenerGrupoId(p.grupo_id) === grupoTienda;
                  }).map((p) => (
                    <option key={p._id} value={p._id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !!loadError || !form.codigo || !form.tienda_id || !form.producto_id || !/^[A-Z]{3}-\d{3}$/.test(form.codigo)}
                  className="flex-1 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {saving ? "Guardando…" : "Crear código"}
                </button>
              </div>
            </div>
        </AdminDialog>
      )}
      {loadError && <ErrorNotice message={loadError} onRetry={fetchData} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((code) => {
          const activo = code.activo;
          return (
            <div key={code._id} className="bg-card rounded-3xl border border-border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${activo ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                  {activo ? <KeyRound size={20} /> : <QrCode size={20} />}
                </div>
                <button
                  onClick={() => toggleCode(code)}
                  disabled={!!toggling}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all ${activo ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-accent/10 text-accent hover:bg-accent/20"}`}
                >
                  {activo ? <PowerOff size={12} /> : <Power size={12} />}
                  {toggling === code._id ? "Guardando…" : activo ? "Desactivar" : "Activar"}
                </button>
              </div>
              <p className="mt-4 font-mono font-semibold text-foreground">{code.codigo}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{getTiendaNombre(code)}</span>
                <span className="text-border">·</span>
                <span>{getProductoNombre(code)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${activo ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                  {activo ? "Activo" : "Inactivo"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(code.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
        {!loadError && codes.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No hay códigos registrados
          </div>
        )}
      </div>
    </div>
  );
}
