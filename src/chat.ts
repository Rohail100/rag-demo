import { createInterface } from 'readline'
import { embed } from './embed'
import { search } from './search'
import { askNemotron } from './llm'
import { SYSTEM_PROMPT, buildChatPrompt } from './prompt'

/** REPL entry point: interactive loop with conversation history, per-turn context retrieval, /exit support */
async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' })

  console.log('RAG Chat — type your question, or /exit to quit\n')
  rl.prompt()

  const conversation: { role: string; content: string }[] = []

  rl.on('line', async (line) => {
    const input = line.trim()
    if (!input) {
      rl.prompt()
      return
    }
    if (input === '/exit' || input === '/quit') {
      rl.close()
      return
    }

    try {
      const queryEmbedding = await embed(input)
      const chunks = search(queryEmbedding)
      const prompt = buildChatPrompt(input, chunks)
      const answer = await askNemotron([
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversation,
        { role: 'user', content: prompt },
      ])

      console.log(`\n${answer}\n`)

      conversation.push({ role: 'user', content: input })
      conversation.push({ role: 'assistant', content: answer })

      if (conversation.length > 12) {
        conversation.splice(0, conversation.length - 12)
      }
    } catch (err) {
      console.error(`\nError: ${(err as Error).message}\n`)
    }

    rl.prompt()
  })

  rl.on('SIGINT', () => {
    console.log()
    rl.close()
  })

  rl.on('close', () => {
    console.log('Goodbye!')
    process.exit(0)
  })
}

main().catch(console.error)
