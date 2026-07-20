import { embed } from './embed'
import { search } from './search'
import { buildPrompt } from './prompt'
import { askNemotron } from './llm'

async function main() {
  const question = process.argv[2]
  if (!question) {
    console.error('Usage: npm run ask -- "your question"')
    process.exit(1)
  }

  console.log('Embedding question...')
  const queryEmbedding = await embed(question)

  console.log('Searching relevant chunks...')
  const chunks = search(queryEmbedding)

  console.log('Building prompt...')
  const prompt = buildPrompt(question, chunks)

  console.log('Asking Nemotron...\n')
  const answer = await askNemotron([{ role: 'user', content: prompt }])

  console.log(answer)
}

main().catch(console.error)
