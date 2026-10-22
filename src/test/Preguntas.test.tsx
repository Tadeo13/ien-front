import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, test, vi } from "vitest";
import Preguntas from "../app/Preguntas";
import { planService } from "../services/plan.service";
import { ThemeProvider } from "../context/ThemeContext";

vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "patient-a" } }) }));
vi.mock("../services/plan.service", () => ({ planService: { getTestPreguntas: vi.fn(), setupTest: vi.fn() } }));

const questions = [
  { numero: 1, texto: "Primera pregunta", competencia_label: "Conciencia" },
  { numero: 2, texto: "Segunda pregunta", competencia_label: "Conciencia" },
];
const mount = () => render(<ThemeProvider><MemoryRouter><Preguntas /></MemoryRouter></ThemeProvider>);

beforeEach(() => {
  vi.mocked(planService.getTestPreguntas).mockResolvedValue(questions);
});

test("un envío fallido conserva las respuestas y permite reintentar", async () => {
  const user = userEvent.setup();
  vi.mocked(planService.setupTest).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({
    plan_id: "plan", dia_actual: 1, estado: "activo", puntuaciones_por_competencia: [], competencias_a_mejorar: [],
  });
  mount();
  await screen.findByText("Primera pregunta");
  await user.click(screen.getByRole("button", { name: "4 de 5" }));
  await user.click(screen.getByRole("button", { name: /Siguiente/ }));
  await user.click(screen.getByRole("button", { name: "2 de 5" }));
  await user.click(screen.getByRole("button", { name: /Crear mi plan/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Puedes volver a intentarlo");
  expect(screen.getByText("Segunda pregunta")).toBeVisible();
  expect(screen.getByRole("button", { name: "2 de 5" })).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: /Crear mi plan/ }));
  await screen.findByText("¡Plan Creado!");
  expect(planService.setupTest).toHaveBeenLastCalledWith({ respuestas: [{ numero: 1, score: 4 }, { numero: 2, score: 2 }], emociones_a_mejorar: [] });
  expect(localStorage.getItem("ien:test-draft:v1:patient-a")).toBeNull();
});

test("recupera la pregunta y las respuestas después de volver a abrir el test", async () => {
  const user = userEvent.setup();
  const first = mount();
  await screen.findByText("Primera pregunta");
  await user.click(screen.getByRole("button", { name: "5 de 5" }));
  await user.click(screen.getByRole("button", { name: /Siguiente/ }));
  await user.click(screen.getByRole("button", { name: "3 de 5" }));
  first.unmount();
  mount();
  await waitFor(() => expect(screen.getByText("Segunda pregunta")).toBeVisible());
  expect(screen.getByRole("button", { name: "3 de 5" })).toHaveAttribute("aria-pressed", "true");
});
