import axios from "axios";

export function errorMessage(error: unknown, fallback = "No se pudo completar la operación. Inténtalo de nuevo.") {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
    const message = error.response.data?.error;
    if (typeof message === "string") return message;
  }
  return fallback;
}
