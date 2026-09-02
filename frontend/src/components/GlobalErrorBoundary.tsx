import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { AlertTriangle, RotateCw, LogIn } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

function getErrorMessage(error: unknown): { message: string; detail: string } {
  if (isRouteErrorResponse(error)) {
    return {
      message: error.statusText || `Error ${error.status}`,
      detail: typeof error.data === "string" ? error.data : "",
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message || "Ocurrió un error inesperado.",
      detail: error.stack || "",
    };
  }
  return {
    message: "Ocurrió un error inesperado.",
    detail: String(error),
  };
}

export default function GlobalErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { message, detail } = getErrorMessage(error);

  useEffect(() => {
    console.error("Error capturado por el errorElement global:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle size={32} className="text-destructive" />
          </div>
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Error
          </div>
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Ups, algo salió mal</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Ocurrió un error inesperado en la aplicación. Podés recargar la página o volver al inicio para continuar.
          </p>

          {(message || detail) && (
            <details className="mt-4 rounded-2xl bg-secondary/50 px-3 py-2 text-left">
              <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
                Ver detalles técnicos
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                {message}
                {detail ? `\n${detail}` : ""}
              </pre>
            </details>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <LogIn size={15} />
              Volver al inicio
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <RotateCw size={15} />
              Recargar la página
            </button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Si el problema continúa, recargá la página o volvé a intentarlo más tarde.
          </p>
        </div>
      </div>
    </div>
  );
}
