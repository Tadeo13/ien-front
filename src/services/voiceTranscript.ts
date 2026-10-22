/** Rebuild the whole session so interim corrections replace text instead of duplicating it. */
export function answerWithTranscript(
  original: string,
  results: ArrayLike<{ 0: { transcript: string } }>,
) {
  const transcript = Array.from(results, result => result[0].transcript.trim())
    .filter(Boolean).join(" ");
  if (!transcript) return original;
  return `${original}${original && !/\s$/.test(original) ? " " : ""}${transcript}`;
}
