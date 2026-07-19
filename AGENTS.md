# Minimal RAG Demo

## Tech Stack
- Node.js + TypeScript (ESM)
- @xenova/transformers (local embeddings)
- OpenRouter API (Nemotron LLM)
- No framework dependencies (no LangChain)

## Structure
knowledge/    - .md source documents (chunked by ## headings)
src/
  ingest.ts   - read .md → chunk → embed → save to storage/chunks.json
  embed.ts    - Transformers.js wrapper (Xenova/all-MiniLM-L6-v2)
  search.ts   - cosine similarity, TopK=3
  prompt.ts   - prompt builder with context
  llm.ts      - OpenRouter client (nvidia/nemotron-3-ultra-550b-a55b:free)
  index.ts    - CLI entry point
storage/      - generated chunks.json (gitignored)

## Commands
- npm run ingest        - rebuild vector index from knowledge/
- npm run ask -- "..."  - query the RAG pipeline

## Conventions
- ESM modules with .ts extensions
- No LangChain — keep custom implementations
- Chunk at ## heading boundaries
