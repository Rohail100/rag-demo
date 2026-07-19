import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import { embed } from './embed'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Chunk {
  text: string
  embedding: number[]
  source: string
}

function readMarkdownFiles(dir: string): { filename: string; content: string }[] {
  const files = readdirSync(dir).filter(f => extname(f) === '.md')
  return files.map(f => ({
    filename: f,
    content: readFileSync(join(dir, f), 'utf-8'),
  }))
}

function chunkContent(content: string, source: string): string[] {
  const lines = content.split('\n')
  const chunks: string[] = []
  let current: string[] = []

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (current.length > 1) {
        chunks.push(current.join('\n').trim())
      }
      current = [line]
    } else if (line.trim()) {
      current.push(line.trim())
    }
  }
  if (current.length > 1) {
    chunks.push(current.join('\n').trim())
  }

  return chunks.filter(c => c.length > 0)
}

async function main() {
  const knowledgeDir = join(__dirname, '..', 'knowledge')
  const storageDir = join(__dirname, '..', 'storage')

  if (!existsSync(storageDir)) {
    mkdirSync(storageDir)
  }

  const files = readMarkdownFiles(knowledgeDir)
  const allChunks: Chunk[] = []

  for (const file of files) {
    const chunks = chunkContent(file.content, file.filename)
    console.log(`  ${file.filename}: ${chunks.length} chunks`)

    for (const text of chunks) {
      const embedding = await embed(text)
      allChunks.push({ text, embedding, source: file.filename })
    }
  }

  writeFileSync(join(storageDir, 'chunks.json'), JSON.stringify(allChunks, null, 2))
  console.log(`\nSaved ${allChunks.length} chunks to storage/chunks.json`)
}

main().catch(console.error)
