import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import AdminProducts from "../app/AdminProducts";
import { adminService } from "../services/admin.service";

vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { rol: "admin_negocio" } }) }));
vi.mock("../services/admin.service", () => ({ adminService: { listarProductos: vi.fn(), crearProducto: vi.fn() } }));

test("un error conserva el formulario y un reintento pendiente bloquea envíos repetidos", async () => {
  vi.mocked(adminService.listarProductos).mockResolvedValue([]);
  let complete!: () => void;
  vi.mocked(adminService.crearProducto).mockRejectedValueOnce(new Error("offline"))
    .mockImplementationOnce(() => new Promise(resolve => { complete = () => resolve({} as never); }));
  const user = userEvent.setup();
  render(<AdminProducts />);
  await user.click(await screen.findByRole("button", { name: "Nuevo producto" }));
  await user.type(screen.getByLabelText("Nombre"), "Producto de prueba");
  await user.click(screen.getByRole("button", { name: "Crear producto" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo guardar");
  expect(screen.getByLabelText("Nombre")).toHaveValue("Producto de prueba");
  await user.dblClick(screen.getByRole("button", { name: "Crear producto" }));
  expect(screen.getByRole("button", { name: "Guardando…" })).toBeDisabled();
  expect(adminService.crearProducto).toHaveBeenCalledTimes(2);
  await act(async () => { complete(); });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
