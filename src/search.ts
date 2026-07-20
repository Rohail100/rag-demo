import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Chunk {
  text: string
  embedding: number[]
  source: string
}

let cachedChunks: Chunk[] | null = null

/** Load chunks from storage/chunks.json, caching them in memory after the first call */
export function loadChunks(): Chunk[] {
  if (!cachedChunks) {
    const raw = readFileSync(join(__dirname, '..', 'storage', 'chunks.json'), 'utf-8')
    cachedChunks = JSON.parse(raw)
  }
  return cachedChunks!
}

/** Compute cosine similarity between two equal-length vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

/** Search cached chunks for the top-K most similar to the query embedding via cosine similarity */
export function search(
  queryEmbedding: number[],
  topK: number = 3
): { text: string; source: string }[] {
  const chunks = loadChunks()

  const scored = chunks.map(chunk => ({
    text: chunk.text,
    source: chunk.source,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, topK)
}
