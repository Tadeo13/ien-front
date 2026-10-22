import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import AdminDialog from "../components/ui/AdminDialog";

test("el diálogo tiene nombre, admite envío con teclado y restaura el foco", async () => {
  const user = userEvent.setup();
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const submit = vi.fn();
  const close = vi.fn();
  const view = render(<AdminDialog title="Nuevo producto" onClose={close} onSubmit={submit}><label>Nombre<input required /></label><button type="submit">Guardar</button></AdminDialog>);
  const dialog = screen.getByRole("dialog", { name: "Nuevo producto" });
  await user.type(screen.getByLabelText("Nombre"), "Producto{Enter}");
  expect(submit).toHaveBeenCalledOnce();
  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  expect(close).toHaveBeenCalledOnce();
  view.unmount();
  expect(trigger).toHaveFocus();
  trigger.remove();
});

test("durante el guardado impide cerrar el diálogo y editar el formulario", () => {
  const close = vi.fn();
  render(<AdminDialog title="Guardando" busy onClose={close} onSubmit={vi.fn()}><label>Nombre<input /></label><button type="submit">Guardar</button></AdminDialog>);
  expect(screen.getByLabelText("Nombre")).toBeDisabled();
  fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
  expect(close).not.toHaveBeenCalled();
});
