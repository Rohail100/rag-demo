# Minimal RAG Demo

A bare-bones Retrieval-Augmented Generation system in TypeScript.
No frameworks, no vector DB — just local embeddings + an LLM API call.

## Quick Start

```bash
cp .env.example .env   # add your OpenRouter API key
npm install
npm run ingest          # index knowledge/*.md
npm run ask -- "Can I return sale items?"   # single query
npm run chat                                  # interactive REPL
```

## How It Works

```
knowledge/*.md
    │
    ▼
  ingest.ts  ── chunk by ## headings
    │
    ▼
  embed.ts   ── Xenova/all-MiniLM-L6-v2 (local)
    │
    ▼
  storage/chunks.json
    │
    ▼ (on query)
  search.ts  ── cosine similarity, TopK=3
    │
    ▼
  prompt.ts  ── build prompt with retrieved context
    │
    ▼
  llm.ts     ── OpenRouter → Nemotron 3 Super (free)
    │
    ▼
  answer
```

## Project Structure

```
.
├── knowledge/           # Source documents (.md)
│   ├── faq.md
│   ├── returns.md
│   └── shipping.md
├── src/
│   ├── ingest.ts        # Indexing pipeline
│   ├── embed.ts         # Local embedding model
│   ├── search.ts        # Cosine similarity search
│   ├── prompt.ts        # Prompt builder
│   ├── chat.ts          # Interactive REPL
│   ├── llm.ts           # OpenRouter API client
│   └── index.ts         # CLI entry point
├── storage/             # Generated chunks.json (gitignored)
├── .env                 # API keys (gitignored)
├── .env.example
├── .gitignore
├── AGENTS.md
├── package.json
└── test-questions.md
```

## Commands

| Command | Description |
|---|---|
| `npm run ingest` | Rebuild vector index from knowledge/ |
| `npm run ask -- "..."` | Query the RAG pipeline |
| `npm run chat` | Interactive REPL with conversation history |

## Test Questions

See `test-questions.md` for a full set of verification queries.
