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
