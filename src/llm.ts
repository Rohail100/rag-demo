import 'dotenv/config'

const API_KEY = process.env.OPENROUTER_API_KEY

/** Send a message array to Nemotron 3 Super via OpenRouter and return the assistant's reply */
export async function askNemotron(
  messages: { role: string; content: string }[]
): Promise<string> {
  if (!API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in .env')
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const choice = data.choices?.[0]
  if (!choice?.message?.content) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data).slice(0, 300)}`)
  }
  return choice.message.content
}
