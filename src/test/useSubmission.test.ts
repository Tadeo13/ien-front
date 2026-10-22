import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useSubmission } from "../hooks/useSubmission";

test("bloquea clics simultáneos y permite un nuevo envío al terminar", async () => {
  let finish!: () => void;
  const request = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useSubmission());
  let pending!: Promise<void>;
  act(() => { pending = result.current.submit(request); void result.current.submit(request); });
  expect(request).toHaveBeenCalledTimes(1);
  expect(result.current.pending).toBe(true);
  await act(async () => { finish(); await pending; });
  expect(result.current.pending).toBe(false);
  const retry = vi.fn(async () => {});
  await act(async () => { await result.current.submit(retry); });
  expect(retry).toHaveBeenCalledOnce();
});
