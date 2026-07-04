import type { PromptFormValues } from "@/lib/schema";

export type PromptOutputs = {
  master: string;
  compact: string;
  structured: string;
  dna: string;
  json: string;
  score: number;
  issues: string[];
};

const label = (name: string, value?: string) =>
  value?.trim() ? `${name}: ${value.trim()}` : "";

const sentence = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(". ").replace(/\s+\./g, ".").trim();

export function composePrompts(values: PromptFormValues): PromptOutputs {
  const technical = `Target GPT Image 2 planning metadata: size ${values.size}, quality ${values.quality}, output format ${values.outputFormat}.`;
  const reference = values.referenceNotes?.trim()
    ? `Reference image analysis notes for visual guidance only: ${values.referenceNotes.trim()}.`
    : "";

  const master = sentence(
    `Create ${article(values.intent)} ${values.intent} featuring ${values.subject}`,
    values.audience ? `The image should speak to ${values.audience}` : undefined,
    values.composition ? `Composition: ${values.composition}` : undefined,
    values.viewpoint ? `Camera or viewpoint: ${values.viewpoint}` : undefined,
    values.environment ? `Setting: ${values.environment}` : undefined,
    values.styleDomain || values.styleModifiers
      ? `Style: ${[values.styleDomain, values.styleModifiers].filter(Boolean).join(", ")}`
      : undefined,
    values.palette ? `Color system: ${values.palette}` : undefined,
    values.lighting ? `Lighting: ${values.lighting}` : undefined,
    values.materials ? `Material and surface detail: ${values.materials}` : undefined,
    values.typography ? `Typography and text handling: ${values.typography}` : undefined,
    values.fidelity ? `Fidelity priorities: ${values.fidelity}` : undefined,
    reference,
    technical,
    values.exclusions ? `Avoid: ${values.exclusions}` : undefined
  );

  const compact = sentence(
    `${values.subject}, ${values.intent}`,
    values.styleDomain,
    values.styleModifiers,
    values.composition,
    values.lighting,
    `${values.size}, ${values.quality} quality`,
    values.exclusions ? `avoid ${values.exclusions}` : undefined
  );

  const structured = [
    label("Subject", values.subject),
    label("Intent", values.intent),
    label("Audience", values.audience),
    label("Composition", values.composition),
    label("Viewpoint", values.viewpoint),
    label("Environment", values.environment),
    label("Style Domain", values.styleDomain),
    label("Style Modifiers", values.styleModifiers),
    label("Palette", values.palette),
    label("Lighting", values.lighting),
    label("Materials", values.materials),
    label("Typography", values.typography),
    label("Reference Notes", values.referenceNotes),
    label("Technical", `${values.size}, ${values.quality}, ${values.outputFormat}`),
    label("Exclusions", values.exclusions),
  ]
    .filter(Boolean)
    .join("\n");

  const dna = [
    values.intent,
    values.styleDomain,
    values.styleModifiers,
    values.palette,
    values.lighting,
    values.materials,
  ]
    .filter(Boolean)
    .join(" / ");

  const jsonPlan = {
    modelTarget: "gpt-image-2",
    generatesImages: false,
    prompt: master,
    settings: {
      size: values.size,
      quality: values.quality,
      outputFormat: values.outputFormat,
    },
    promptDna: dna,
    negativeConstraints: values.exclusions,
    referenceAnalysisOnly: values.referenceNotes || null,
  };

  const { score, issues } = scorePrompt(values, master);

  return {
    master,
    compact,
    structured,
    dna,
    json: JSON.stringify(jsonPlan, null, 2),
    score,
    issues,
  };
}

function scorePrompt(values: PromptFormValues, master: string) {
  const checks: Array<[boolean, string, number]> = [
    [values.subject.trim().length > 12, "Subject needs more concrete detail.", 14],
    [values.intent.trim().length > 4, "Intent is missing or too vague.", 10],
    [Boolean(values.composition?.trim()), "Add framing, hierarchy, or spatial composition.", 12],
    [Boolean(values.styleDomain?.trim() || values.styleModifiers?.trim()), "Add a style domain or modifiers.", 12],
    [Boolean(values.lighting?.trim()), "Lighting is unspecified.", 10],
    [Boolean(values.palette?.trim()), "Color palette is unspecified.", 8],
    [Boolean(values.materials?.trim()), "Material and texture detail is thin.", 8],
    [Boolean(values.fidelity?.trim()), "Add fidelity priorities for production control.", 8],
    [Boolean(values.exclusions?.trim()), "Add exclusions for common image defects.", 8],
    [master.length > 420, "Master prompt is short for a production brief.", 10],
  ];

  const score = checks.reduce((total, [passed, , points]) => total + (passed ? points : 0), 0);
  const issues = checks.filter(([passed]) => !passed).map(([, issue]) => issue);

  return { score: Math.min(100, score), issues };
}

function article(phrase: string) {
  return /^[aeiou]/i.test(phrase.trim()) ? "an" : "a";
}
