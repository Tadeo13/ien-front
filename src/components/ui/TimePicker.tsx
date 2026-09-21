import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimePickerProps {
  hora: number;
  minuto: number;
  onChange: (value: { hora: number; minuto: number }) => void;
  disabled?: boolean;
}

export default function TimePicker({ hora, minuto, onChange, disabled = false }: TimePickerProps) {
  const [hourDir, setHourDir] = useState(1);
  const [minDir, setMinDir] = useState(1);
  const [editingHour, setEditingHour] = useState(false);
  const [editingMinute, setEditingMinute] = useState(false);
  const [rawHour, setRawHour] = useState("");
  const [rawMinute, setRawMinute] = useState("");
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const cycleHour = (dir: 1 | -1) => {
    if (disabled) return;
    setHourDir(dir);
    let next = hora + dir;
    if (next < 0) next = 23;
    if (next > 23) next = 0;
    onChange({ hora: next, minuto });
  };

  const cycleMinute = (dir: 1 | -1) => {
    if (disabled) return;
    setMinDir(dir);
    onChange({ hora, minuto: minuto === 0 ? 30 : 0 });
  };

  const startEditHour = () => {
    if (disabled) return;
    setRawHour(String(hora));
    setEditingHour(true);
    setTimeout(() => hourInputRef.current?.select(), 0);
  };

  const startEditMinute = () => {
    if (disabled) return;
    setRawMinute(String(minuto));
    setEditingMinute(true);
    setTimeout(() => minuteInputRef.current?.select(), 0);
  };

  const commitHour = () => {
    const n = parseInt(rawHour);
    if (!isNaN(n) && n >= 0 && n <= 23) onChange({ hora: n, minuto });
    setEditingHour(false);
  };

  const commitMinute = () => {
    const n = parseInt(rawMinute);
    if (n === 0 || n === 30) {
      onChange({ hora, minuto: n });
    } else if (n < 15) {
      onChange({ hora, minuto: 0 });
    } else {
      onChange({ hora, minuto: 30 });
    }
    setEditingMinute(false);
  };

  const keyHour = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitHour();
    if (e.key === "Escape") setEditingHour(false);
  };

  const keyMinute = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitMinute();
    if (e.key === "Escape") setEditingMinute(false);
  };

  const timeDisplay = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;

  const numberBox = (
    value: number,
    dir: number,
    editing: boolean,
    raw: string,
    onStartEdit: () => void,
    onChangeRaw: (e: ChangeEvent<HTMLInputElement>) => void,
    onCommit: () => void,
    onKey: (e: KeyboardEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    key: string,
    pad: number = 2,
  ) => (
    <div className="w-16 h-16 flex items-center justify-center">
      {editing ? (
        <motion.input
          key={`${key}-input`}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={onChangeRaw}
          onBlur={onCommit}
          onKeyDown={onKey}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full h-full text-center text-2xl font-mono font-bold bg-secondary rounded-xl border-2 border-primary outline-none text-foreground"
        />
      ) : (
        <motion.button
          key={`${key}-${value}`}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 24 }),
            center: { opacity: 1, x: 0 },
          }}
          initial="enter"
          animate="center"
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={onStartEdit}
          disabled={disabled}
          className="w-full h-full text-2xl font-mono font-bold rounded-xl bg-secondary/50 border border-border hover:border-foreground/25 transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {String(value).padStart(pad, "0")}
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      {/* Hora */}
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3 text-center">
        Hora
      </p>
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => cycleHour(-1)}
          disabled={disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {numberBox(hora, hourDir, editingHour, rawHour, startEditHour, (e: ChangeEvent<HTMLInputElement>) => setRawHour(e.target.value.replace(/[^0-9]/g, "")), commitHour, keyHour, hourInputRef, "hour")}
        <button
          type="button"
          onClick={() => cycleHour(1)}
          disabled={disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Minuto */}
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3 text-center">
        Minuto
      </p>
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => cycleMinute(-1)}
          disabled={disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {numberBox(minuto, minDir, editingMinute, rawMinute, startEditMinute, (e: ChangeEvent<HTMLInputElement>) => setRawMinute(e.target.value.replace(/[^0-9]/g, "")), commitMinute, keyMinute, minuteInputRef, "min")}
        <button
          type="button"
          onClick={() => cycleMinute(1)}
          disabled={disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dots de horas */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {Array.from({ length: 24 }, (_, h) => (
          <button
            key={h}
            type="button"
            onClick={() => !disabled && onChange({ hora: h, minuto })}
            disabled={disabled}
            className={`h-1.5 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
              h === hora ? "w-5 bg-primary" : "w-1.5 bg-muted hover:bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {timeDisplay} ·{" "}
        {hora === 0 && minuto === 0
          ? "Medianoche"
          : hora === 12 && minuto === 0
          ? "Mediodía"
          : hora < 12
          ? "AM"
          : "PM"}
      </p>
    </>
  );
}
