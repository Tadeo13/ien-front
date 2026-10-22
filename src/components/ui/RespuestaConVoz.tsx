import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Mic, Volume2, Square, Keyboard, Loader2, AudioLines } from "lucide-react";
import { answerWithTranscript } from "../../services/voiceTranscript";
import type { ToneColors } from "../../hooks/useToneColors";

interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: ArrayLike<RecognitionResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

let activeRecognition: Recognition | null = null;
let activeReader: { utterance: SpeechSynthesisUtterance; stop: () => void } | null = null;

function stopReading() {
  const reader = activeReader;
  activeReader = null;
  reader?.stop();
  window.speechSynthesis?.cancel();
}

interface Props {
  value: string;
  onChange?: (value: string) => void;
  label: string;
  readOnly?: boolean;
  tone: ToneColors;
}

export default function RespuestaConVoz({ value, onChange, label, readOnly = false, tone }: Props) {
  const [listening, setListening] = useState(false);
  const [starting, setStarting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopRequestedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const focusTextRef = useRef(false);
  valueRef.current = value;
  onChangeRef.current = onChange;

  const browser = window as RecognitionWindow;
  const RecognitionConstructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
  const canDictate = !!RecognitionConstructor && window.isSecureContext;
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const isOpera = /OPR\//.test(navigator.userAgent);

  const clearDictationTimeout = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const useKeyboard = () => {
    focusTextRef.current = true;
    if (recognitionRef.current) {
      stopRequestedRef.current = true;
      recognitionRef.current.stop();
    }
    setMode("text");
  };

  const dictationFailed = (message: string) => {
    focusTextRef.current = true;
    setError(message);
    setMode("text");
  };

  useEffect(() => () => {
    clearDictationTimeout();
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      if (activeRecognition === recognition) activeRecognition = null;
    }
    if (utteranceRef.current && activeReader?.utterance === utteranceRef.current) {
      stopReading();
    }
  }, []);

  const toggleDictation = () => {
    if (recognitionRef.current) {
      stopRequestedRef.current = true;
      clearDictationTimeout();
      recognitionRef.current.stop();
      return;
    }
    if (!RecognitionConstructor || !canDictate || readOnly) return;
    stopReading();
    activeRecognition?.abort();
    const recognition = new RecognitionConstructor();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    activeRecognition = recognition;
    setError(null);
    setMode("voice");
    setStarting(true);
    stopRequestedRef.current = false;

    let receivedResult = false;
    let failed = false;
    const originalAnswer = valueRef.current;
    const armTimeout = () => {
      clearDictationTimeout();
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current !== recognition) return;
        failed = true;
        dictationFailed(isOpera
          ? "El dictado no respondió en Opera GX. Puedes seguir escribiendo o probar la voz en Chrome."
          : "No recibimos una transcripción. Puedes seguir escribiendo o volver a probar el micrófono.");
        recognition.abort();
        recognitionRef.current = null;
        if (activeRecognition === recognition) activeRecognition = null;
        setStarting(false);
        setListening(false);
      }, 20000);
    };
    recognition.onstart = () => {
      if (recognitionRef.current !== recognition) return;
      setStarting(false);
      setListening(true);
    };

    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return;
      receivedResult = true;
      armTimeout();
      // Los resultados provisionales se muestran y guardan en el mismo campo.
      const next = answerWithTranscript(originalAnswer, event.results);
      valueRef.current = next;
      onChangeRef.current?.(next);
    };
    recognition.onerror = ({ error: code }) => {
      failed = true;
      clearDictationTimeout();
      setStarting(false);
      setListening(false);
      const messages: Record<string, string> = {
        "not-allowed": "Permite el acceso al micrófono en el navegador para dictar.",
        "service-not-allowed": "El navegador no permite el servicio de dictado.",
        "audio-capture": "No se encontró un micrófono disponible. Revisa su conexión y permisos.",
        "no-speech": "No se detectó voz. Pulsa Dictar para intentarlo otra vez.",
        network: isOpera
          ? "Opera GX no pudo conectar con el servicio de dictado. Prueba en Google Chrome con el micrófono permitido."
          : "No se pudo conectar al servicio de dictado. Revisa tu conexión.",
      };
      if (code !== "aborted") dictationFailed(messages[code] ?? "No se pudo realizar el dictado. Puedes continuar escribiendo.");
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        clearDictationTimeout();
        recognitionRef.current = null;
        setStarting(false);
        setListening(false);
        if (!receivedResult && !failed && !stopRequestedRef.current) {
          dictationFailed(isOpera
            ? "Opera GX terminó el dictado sin reconocer texto. Prueba esta misma página en Google Chrome."
            : "El dictado terminó sin reconocer texto. Revisa el micrófono y vuelve a intentarlo.");
        }
      }
      if (activeRecognition === recognition) activeRecognition = null;
    };
    try {
      recognition.start();
      armTimeout();
    } catch {
      clearDictationTimeout();
      recognitionRef.current = null;
      if (activeRecognition === recognition) activeRecognition = null;
      setListening(false);
      setStarting(false);
      dictationFailed("No se pudo iniciar el micrófono. Puedes escribir tu respuesta o revisar los permisos.");
    }
  };

  const toggleReading = () => {
    if (speaking) {
      stopReading();
      return;
    }
    if (!canSpeak || !value.trim()) return;
    activeRecognition?.stop();
    stopReading();
    setError(null);
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "es-ES";
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === "es-ES") ?? voices.find(v => v.lang.startsWith("es"));
    if (voice) utterance.voice = voice;
    const finish = () => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      setSpeaking(false);
      if (activeReader?.utterance === utterance) activeReader = null;
    };
    utterance.onend = finish;
    utterance.onerror = (event) => {
      if (utteranceRef.current !== utterance) return;
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setError("No se pudo leer el texto en voz alta. Inténtalo de nuevo.");
      }
      finish();
    };
    utteranceRef.current = utterance;
    activeReader = { utterance, stop: finish };
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const buttonClass = "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed";
  const recording = listening || starting;
  const voiceMode = mode === "voice" && canDictate;
  const palette = {
    "--voice-color": tone.color,
    "--voice-bg": tone.bg,
    "--voice-soft": tone.soft,
    "--voice-border": tone.border,
    "--voice-text": tone.text,
  } as CSSProperties;

  useEffect(() => {
    if (mode === "text" && !recording && focusTextRef.current) {
      textareaRef.current?.focus();
      focusTextRef.current = false;
    }
  }, [mode, recording]);

  return (
    <div style={palette} className={`overflow-hidden rounded-2xl border-2 transition-colors ${recording ? "border-[var(--voice-border)] bg-[var(--voice-bg)]" : "border-border bg-background"}`}>
      {readOnly ? (
        <div className="p-4 text-sm italic text-muted-foreground whitespace-pre-line">{value}</div>
      ) : (
        <>
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${voiceMode ? "bg-[var(--voice-soft)] text-[color:var(--voice-text)]" : "bg-secondary text-muted-foreground"}`}>
              {voiceMode ? <Mic size={20} /> : <Keyboard size={20} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{voiceMode ? "Responde con tu voz" : "Escribe tu respuesta"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{voiceMode ? "Habla con calma. Tus palabras aparecerán aquí." : "A tu ritmo. Puedes revisar y editar lo que escribas."}</p>
            </div>
          </div>

          {voiceMode && (
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={toggleDictation}
                aria-pressed={recording}
                aria-label={`${recording ? "Terminar dictado" : "Toca para hablar"}: ${label}`}
                className={`flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-b-4 border-[var(--voice-border)] px-4 py-3 text-sm font-bold text-[color:var(--voice-text)] transition-all active:translate-y-0.5 active:border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--voice-color)] focus-visible:ring-offset-2 ${recording ? "bg-[var(--voice-bg)]" : "bg-[var(--voice-soft)] hover:bg-[var(--voice-bg)]"}`}
              >
                {starting ? <Loader2 size={22} className="animate-spin motion-reduce:animate-none" /> : listening ? <AudioLines size={22} className="animate-pulse motion-reduce:animate-none" /> : <Mic size={22} />}
                {starting ? "Cancelar inicio" : listening ? "Terminar dictado" : value.trim() ? "Seguir hablando" : "Toca para hablar"}
              </button>
              <p role="status" className="mt-2 text-center text-xs text-muted-foreground">
                {starting ? "Iniciando… Acepta el permiso del micrófono si aparece." : listening ? "Te escucho… El texto se actualiza mientras hablas." : "Pulsa el micrófono cuando estés listo."}
              </p>
            </div>
          )}
          {!voiceMode && recording && <p role="status" className="px-4 pb-3 text-xs text-muted-foreground">Terminando el dictado para que puedas editar…</p>}

          <div className="mx-4 mb-3 rounded-xl border border-border bg-card focus-within:border-[var(--voice-border)] focus-within:ring-2 focus-within:ring-[var(--voice-soft)]">
            <div className="flex items-center justify-between gap-2 px-3 pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tu respuesta</span>
              {listening && <span className="flex items-center gap-1.5 text-[10px] font-medium text-[color:var(--voice-text)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--voice-color)] animate-pulse motion-reduce:animate-none" />En vivo</span>}
            </div>
            <textarea
              ref={textareaRef}
              aria-label={label}
              readOnly={recording}
              className="block min-h-32 w-full resize-y rounded-xl bg-transparent p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              placeholder={voiceMode ? "Lo que digas aparecerá aquí… También puedes escribir." : "Escribe tu respuesta aquí…"}
              value={value}
              onChange={event => {
                valueRef.current = event.target.value;
                onChange?.(event.target.value);
              }}
            />
          </div>
        </>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-4">
        {!readOnly && (
          voiceMode ? (
            <button type="button" onClick={useKeyboard} className="inline-flex items-center gap-2 rounded-lg py-2 text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--voice-color)]">
              <Keyboard size={16} />Prefiero escribir
            </button>
          ) : canDictate ? (
            <button type="button" onClick={() => { setMode("voice"); setError(null); }} className="inline-flex items-center gap-2 rounded-lg py-2 text-xs font-semibold text-[color:var(--voice-text)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--voice-color)]">
              <Mic size={16} />Prefiero responder por voz
            </button>
          ) : <span className="text-xs text-muted-foreground">Respuesta con teclado</span>
        )}
        <button type="button" onClick={toggleReading} disabled={!canSpeak || !value.trim() || recording} aria-pressed={speaking} aria-label={`${speaking ? "Detener lectura" : "Escuchar respuesta"}: ${label}`} className={buttonClass}>
          {speaking ? <Square size={14} /> : <Volume2 size={14} />}
          {speaking ? "Detener lectura" : "Escuchar"}
        </button>
      </div>
      {!readOnly && canDictate && isOpera && (
        <p className="px-4 pb-3 text-xs text-muted-foreground">¿La voz no responde en Opera GX? Puedes escribir aquí o probar el dictado en Chrome.</p>
      )}
      {!readOnly && !canDictate && (
        <p className="px-4 pb-3 text-xs text-muted-foreground">
          {window.isSecureContext ? "El dictado no está disponible en este navegador. Puedes responder por texto." : "El dictado necesita HTTPS o localhost. Mientras tanto, puedes responder por texto."}
        </p>
      )}
      {!canSpeak && <p className="px-4 pb-3 text-xs text-muted-foreground">La lectura en voz alta no está disponible en este navegador.</p>}
      {error && <div role="alert" className="mx-4 mb-4 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{error}{!readOnly && mode === "text" && <p className="mt-1 font-medium">Continúa en la caja de texto. Tu respuesta se conserva.</p>}</div>}
    </div>
  );
}
