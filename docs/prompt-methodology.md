# Prompt Methodology

Prompt Atelier composes image prompts as production briefs rather than decorative text. A strong GPT Image 2 prompt should define the visual decision space, reduce ambiguity, and preserve creative latitude where exact control is unnecessary.

## Prompt Layers

1. Subject: the primary object, person, scene, or artifact.
2. Intent: the image's job, such as editorial portrait, product ad, concept art, UI mockup, poster, storyboard frame, or packaging study.
3. Composition: framing, viewpoint, subject scale, depth, balance, focal hierarchy, and negative space.
4. Style: medium, era, movement, genre, surface treatment, and visual references by category rather than living-artist imitation.
5. Lighting: direction, softness, contrast, color temperature, shadows, reflections, and atmosphere.
6. Material Detail: textures, finishes, wear, micro-detail, typography behavior, and environmental cues.
7. Technical Output: aspect ratio, intended size, quality, output format, lens or layout constraints, and fidelity priorities.
8. Guardrails: elements to avoid, legibility requirements, safety-aware constraints, and brand or production limitations.

## Composition Rules

- Put the most important subject early.
- Use concrete nouns and spatial relationships.
- Prefer "three-quarter view on a matte graphite surface" over "cool product shot."
- Specify where text belongs if text is required.
- Limit competing focal points.
- Use negative prompts for production defects, not as a dumping ground for every unwanted idea.

## Stylistic Depth

Stylistic depth comes from combining compatible descriptors:

- Visual era: Bauhaus, early web editorial, 1970s product photography, contemporary museum catalog.
- Medium: risograph print, large-format film, vector poster, clay maquette, glossy 3D render.
- Surface: brushed aluminum, deckled paper, translucent acrylic, oxidized copper, soft cotton rag.
- Light logic: north-window daylight, strip-box reflection, sodium-vapor streetlight, overcast diffusion.
- Color system: restrained neutrals with vermilion accent, split-complementary palette, low-saturation coastal tones.

## Output Variants

Prompt Atelier generates five prompt views:

- Master: full production-ready prompt.
- Compact: short prompt for quick iteration.
- Structured: labeled sections for review.
- DNA: compact style genome describing the core visual identity.
- JSON: machine-readable prompt plan for storage or handoff.

## Quality Score

The score is heuristic. It rewards:

- Specific subject and intent.
- Composition and lighting clarity.
- Concrete style vocabulary.
- Technical choices matching GPT Image controls.
- Useful exclusions.
- Reference-image notes when provided.

It penalizes:

- Empty or vague fields.
- Contradictory style or format choices.
- Excessively short outputs.
- Unsupported promises of exactness.
