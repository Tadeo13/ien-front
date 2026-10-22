import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Suspense } from "react";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<div role="status" className="flex min-h-dvh items-center justify-center gap-3 bg-background text-muted-foreground"><span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />Cargando…</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
