import { useMemo, useRef, useState, type SetStateAction } from "react";

export function useLocalDraft<T>(key: string, initialValue: T, validate: (value: unknown) => value is T) {
  const restored = useMemo(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || "null");
      return validate(value) ? value : initialValue;
    } catch {
      return initialValue;
    }
    // El borrador se restaura únicamente cuando cambia su propietario/actividad.
  }, [key]);
  const [state, setState] = useState({ key, value: restored });
  const value = state.key === key ? state.value : restored;
  const valueRef = useRef(value);
  valueRef.current = value;

  const setValue = (update: SetStateAction<T>) => {
    const next = typeof update === "function" ? (update as (previous: T) => T)(valueRef.current) : update;
    valueRef.current = next;
    setState({ key, value: next });
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* El formulario sigue disponible. */ }
  };
  const clear = () => {
    try { localStorage.removeItem(key); } catch { /* El envío al servidor ya fue confirmado. */ }
    valueRef.current = initialValue;
    setState({ key, value: initialValue });
  };
  return [value, setValue, clear] as const;
}
