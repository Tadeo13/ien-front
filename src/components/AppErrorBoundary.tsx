import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isTranslationError: boolean;
}

/**
 * Detecta si el error es causado por la traducción automática del navegador
 * (Google Translate, Safari Translate, etc.) que muta el DOM directamente
 * y desincroniza el árbol virtual de React.
 */
function isTranslationCrash(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    // Chrome / Firefox / Samsung Internet
    (msg.includes("removechild") || msg.includes("insertbefore")) &&
    msg.includes("not a child") ||
    // Safari
    msg.includes("the node to be removed is not a child of this node") ||
    // Edge / IE legacy phrasing
    msg.includes("invalid state") && msg.includes("node")
  );
}

/**
 * AppErrorBoundary — captura errores a nivel de React antes de que lleguen
 * al errorElement del router (GlobalErrorBoundary).
 *
 * Comportamiento:
 * - Si el error es de traducción del navegador → recarga silenciosa.
 * - Si el error es otro → muestra un fallback mínimo (no crashea sin info).
 */
export default class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isTranslationError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      isTranslationError: isTranslationCrash(error),
    };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    if (isTranslationCrash(error)) {
      // Error silencioso: no lo reportamos como crash real
      console.warn(
        "[AppErrorBoundary] Error de traducción del navegador detectado. Recargando automáticamente.",
        error
      );
      // Pequeño delay para que el log se escriba antes de recargar
      setTimeout(() => window.location.reload(), 100);
    } else {
      console.error("[AppErrorBoundary] Error no controlado:", error, info);
    }
  }

  render() {
    if (this.state.hasError && !this.state.isTranslationError) {
      // Fallback mínimo para errores no relacionados con traducción
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: "1rem",
            backgroundColor: "var(--background, #fff)",
            color: "var(--foreground, #111)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 360 }}>
            <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 16 }}>
              Algo salió mal. Por favor recargá la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 24px",
                borderRadius: 16,
                border: "none",
                background: "#111",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    // Si es error de traducción: no renderizamos nada mientras recarga
    if (this.state.hasError && this.state.isTranslationError) {
      return null;
    }

    return this.props.children;
  }
}
