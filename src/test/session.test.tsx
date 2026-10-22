import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import api from "../services/api";

function Session() {
  const { isAuthenticated, logout } = useAuth();
  return <><p>{isAuthenticated ? "Con sesión" : "Sin sesión"}</p><button onClick={() => void logout()}>Salir</button></>;
}

test("cerrar sesión limpia el estado y las credenciales antes de que responda el servidor", async () => {
  const user = userEvent.setup();
  localStorage.setItem("access_token", "access");
  localStorage.setItem("refresh_token", "refresh");
  api.defaults.headers.common.Authorization = "Bearer old";
  vi.spyOn(authService, "getProfile").mockResolvedValue({ id: "patient", nombre: "Paciente", email: "p@example.com" });
  let complete!: () => void;
  vi.spyOn(api, "post").mockImplementation(() => new Promise(resolve => { complete = () => resolve({ data: {} }); }));
  render(<AuthProvider><Session /></AuthProvider>);
  await screen.findByText("Con sesión");
  await user.click(screen.getByRole("button", { name: "Salir" }));
  await waitFor(() => expect(screen.getByText("Sin sesión")).toBeVisible());
  expect(localStorage.getItem("access_token")).toBeNull();
  expect(localStorage.getItem("refresh_token")).toBeNull();
  expect(api.defaults.headers.common.Authorization).toBeUndefined();
  complete();
});
