import { pipeline } from '@xenova/transformers'

let embedder: any = null

/** Get or create the singleton Transformers.js feature-extraction pipeline */
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

/** Embed a text string into a 384-dimensional normalized vector using all-MiniLM-L6-v2 */
export async function embed(text: string): Promise<number[]> {
  const extractor = await getEmbedder()
  const result = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(result.data)
}
