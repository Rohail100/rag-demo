/** System instruction for the chat REPL — enforces context-only answers */
export const SYSTEM_PROMPT = `You are a helpful customer support agent. Answer ONLY using the provided context. If the answer is not in the context, say you don't know. Be concise and helpful.`

/** Build a user prompt for the chat REPL with fresh context and question */
export function buildChatPrompt(
  question: string,
  chunks: { text: string; source: string }[]
): string {
  const context = chunks
    .map(c => `[${c.source}]\n${c.text}`)
    .join('\n\n')
  return `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`
}

/** Build a full prompt (system instruction + context + question) for single-query mode */
export function buildPrompt(
  question: string,
  chunks: { text: string; source: string }[]
): string {
  const context = chunks
    .map(c => `[${c.source}]\n${c.text}`)
    .join('\n\n')

  return `You are a helpful customer support agent. Answer ONLY using the provided context. If the answer is not in the context, say you don't know.

Context:
${context}

Question: ${question}

Answer:`
}
