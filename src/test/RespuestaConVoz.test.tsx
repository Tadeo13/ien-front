import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import RespuestaConVoz from "../components/ui/RespuestaConVoz";

class MockRecognition {
  static current: MockRecognition;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  onresult: ((event: { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] }) => void) | null = null;
  constructor() { MockRecognition.current = this; }
  start() { this.onstart?.(); }
  stop() { this.onend?.(); }
  abort() { this.onend?.(); }
}
const tone = { color: "#4DAAA0", bg: "#E6F5F3", soft: "#B8E8E2", border: "#80CFC5", text: "#1E6860" };
function Answer() {
  const [value, setValue] = useState("Ya escrito.");
  return <RespuestaConVoz value={value} onChange={setValue} label="Respuesta abierta" tone={tone} />;
}

beforeEach(() => {
  vi.stubGlobal("SpeechRecognition", MockRecognition);
  vi.stubGlobal("isSecureContext", true);
});

test("el dictado provisional se ve en la caja y sus correcciones no duplican texto", () => {
  render(<Answer />);
  fireEvent.click(screen.getByRole("button", { name: /Toca para hablar/ }));
  const emit = (text: string, isFinal = false) => act(() => MockRecognition.current.onresult?.({ resultIndex: 0, results: [{ isFinal, 0: { transcript: text } }] }));
  emit("hoy me sien");
  expect(screen.getByRole("textbox")).toHaveValue("Ya escrito. hoy me sien");
  emit("hoy me siento bien", true);
  expect(screen.getByRole("textbox")).toHaveValue("Ya escrito. hoy me siento bien");
  fireEvent.click(screen.getByRole("button", { name: /Terminar dictado/ }));
  fireEvent.click(screen.getByRole("button", { name: "Prefiero escribir" }));
  expect(screen.getByRole("textbox")).not.toHaveAttribute("readonly");
  expect(screen.getByRole("textbox")).toHaveFocus();
});

test("si el servicio no responde pasa a texto y conserva la respuesta", () => {
  vi.useFakeTimers();
  render(<Answer />);
  fireEvent.click(screen.getByRole("button", { name: /Toca para hablar/ }));
  act(() => vi.advanceTimersByTime(20000));
  expect(screen.getByText("Escribe tu respuesta")).toBeVisible();
  expect(screen.getByRole("textbox")).toHaveValue("Ya escrito.");
  expect(screen.getByRole("textbox")).not.toHaveAttribute("readonly");
  expect(screen.getByRole("alert")).toHaveTextContent("Tu respuesta se conserva");
});
