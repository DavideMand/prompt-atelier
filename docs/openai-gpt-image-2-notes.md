# OpenAI GPT Image 2 Notes

These notes summarize only official OpenAI documentation used by Prompt Atelier.

Sources:

- OpenAI API guide: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI Images API reference: https://developers.openai.com/api/reference/resources/images

## Model

- The OpenAI image generation guide names `gpt-image-2` as one of the GPT Image models.
- `gpt-image-2` can be used through OpenAI image generation surfaces, including the Images API and the Responses API image generation tool.
- Prompt Atelier does not call those APIs and does not generate images. It only prepares prompts intended for later use with GPT Image 2.

## Parameters To Account For In Prompts

The API reference documents these generation and edit controls for image requests:

- `size`: `1024x1024`, `1024x1536`, `1536x1024`, or `auto`.
- `quality`: `low`, `medium`, `high`, or `auto`.
- `output_format`: `png`, `webp`, or `jpeg`.

Prompt Atelier mirrors these choices as prompt-planning metadata so users can describe the intended output precisely without sending a generation request.

## Moderation And Safety

OpenAI documents moderation-blocked image generation errors. Blocks can occur from prompt or input content, downstream output moderation, or an unknown stage. Public category examples include harassment, self-harm, sexual content, and violence.

Prompt Atelier should therefore:

- Help users write neutral, visual, production-focused prompts.
- Avoid wording that targets, humiliates, or abuses real people.
- Keep reference-image notes descriptive and non-invasive.
- Avoid promising that a prompt will bypass model or platform safety systems.

## Limitations

OpenAI states that GPT Image models are powerful but still have limitations. Prompt Atelier should never imply perfect controllability or guaranteed rendering.

Practical prompt implications:

- Be explicit about composition, subject count, text placement, aspect ratio, and hierarchy.
- Avoid overloading one prompt with too many unrelated constraints.
- Prefer clear visual instructions over abstract adjectives alone.
- Include rendering intent, medium, lighting, camera or layout logic, and negative constraints when useful.

## Non-Goals

Prompt Atelier must not:

- Create an Images API route.
- Generate, edit, or stream images.
- Store uploaded reference images.
- Claim undocumented GPT Image 2 capabilities, limits, costs, or availability.
