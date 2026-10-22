import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { expect, test, vi } from "vitest";
import AdminPatients from "../app/AdminPatients";
import { adminService } from "../services/admin.service";
import { ThemeProvider } from "../context/ThemeContext";

vi.mock("../services/admin.service", () => ({ adminService: { listarPacientes: vi.fn() } }));

test("buscar desde otra página consulta al servidor desde la primera página", async () => {
  vi.mocked(adminService.listarPacientes).mockImplementation(async (page = 1, _limit, search) => ({ pacientes: [], total: search ? 1 : 41, pagina: page }));
  const user = userEvent.setup();
  render(<ThemeProvider><MemoryRouter><AdminPatients /></MemoryRouter></ThemeProvider>);
  await screen.findByRole("button", { name: "Página siguiente" });
  await user.click(screen.getByRole("button", { name: "Página siguiente" }));
  await waitFor(() => expect(adminService.listarPacientes).toHaveBeenLastCalledWith(2, 20, "", expect.any(AbortSignal)));
  await user.type(screen.getByRole("textbox", { name: /Buscar pacientes/ }), "Ana");
  await waitFor(() => expect(adminService.listarPacientes).toHaveBeenLastCalledWith(1, 20, "Ana", expect.any(AbortSignal)));
  expect(screen.getByText("Página 1 de 1")).toBeVisible();
});
