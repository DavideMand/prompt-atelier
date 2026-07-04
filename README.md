# Prompt Atelier

Prompt Atelier is a local Next.js workbench for composing production-ready GPT Image 2 prompts.

It does not generate images, does not call the OpenAI Images API, and does not require an API key.

## Features

- Guided visual prompt form
- Progressive disclosure input sections
- Local reference image analysis for dimensions and sampled colors
- Output tabs: Master, Compact, Structured, DNA, JSON
- Prompt quality score with issue hints
- Copy and export to `.txt` or `.json`

## Local Development

```bash
pnpm install
pnpm dev
```

Then open `http://127.0.0.1:3000`.

## Verification

```bash
pnpm typecheck
pnpm build
```
