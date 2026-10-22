import { useRef, useState } from "react";

/** El bloqueo síncrono evita dos envíos antes del siguiente render. */
export function useSubmission() {
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const submit = async (action: () => Promise<void>) => {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    try { await action(); }
    finally { lock.current = false; setPending(false); }
  };
  return { pending, submit };
}
