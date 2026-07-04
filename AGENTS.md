# Prompt Atelier Agent Instructions

## Project Intent

Prompt Atelier is a Next.js App Router application for composing production-ready prompts for GPT Image 2. It does not generate images.

## Durable Rules

- Do not add an Images API route.
- Do not add image generation, image editing, or image streaming.
- Do not require an OpenAI API key unless the user explicitly reintroduces API-backed behavior.
- Keep uploaded reference images client-side and use them only for local descriptive analysis.
- Use only official OpenAI documentation when documenting GPT Image 2 behavior or limits.
- Distinguish product methodology from official model claims.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- react-hook-form
- zod

## UX Rules

- Keep the interface as a minimal two-column workbench.
- Use progressive disclosure for advanced controls.
- Preserve output tabs: Master, Compact, Structured, DNA, JSON.
- Keep copy and export actions visible near the output.
- Do not turn the first screen into a landing page.

## Verification

- Run `npm run lint` after code changes when dependencies are installed.
- Run `npm run typecheck` when TypeScript changes are material.
- If dependencies are unavailable, report that verification could not be completed locally.
