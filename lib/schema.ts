import { z } from "zod";

export const promptSchema = z.object({
  subject: z.string().min(3, "Describe the subject."),
  intent: z.string().min(2, "Choose an intent."),
  audience: z.string().optional(),
  composition: z.string().optional(),
  viewpoint: z.string().optional(),
  environment: z.string().optional(),
  styleDomain: z.string().optional(),
  styleModifiers: z.string().optional(),
  palette: z.string().optional(),
  lighting: z.string().optional(),
  materials: z.string().optional(),
  typography: z.string().optional(),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]),
  quality: z.enum(["low", "medium", "high", "auto"]),
  outputFormat: z.enum(["png", "webp", "jpeg"]),
  fidelity: z.string().optional(),
  exclusions: z.string().optional(),
  referenceNotes: z.string().optional(),
});

export type PromptFormValues = z.infer<typeof promptSchema>;

export const defaultPromptValues: PromptFormValues = {
  subject: "A precision desk lamp made from smoked glass and brushed steel",
  intent: "premium product advertising hero image",
  audience: "design-conscious buyers and art directors",
  composition: "centered three-quarter view, generous negative space, subtle diagonal shadow line",
  viewpoint: "eye-level studio camera, 70mm product lens feel",
  environment: "quiet editorial studio with a warm gray backdrop and matte stone plinth",
  styleDomain: "museum-grade commercial photography",
  styleModifiers: "restrained luxury, tactile minimalism, contemporary design catalog",
  palette: "warm gray, charcoal, smoked amber, small glints of polished steel",
  lighting: "large softbox from upper left, thin rim light on the glass edge, controlled reflections",
  materials: "smoked glass shade, brushed steel armature, honed stone surface, faint fingerprints avoided",
  typography: "no visible text unless added later as clean catalog typography",
  size: "1536x1024",
  quality: "high",
  outputFormat: "png",
  fidelity: "prioritize crisp material edges, believable reflections, and exact silhouette readability",
  exclusions: "warped geometry, extra lamp parts, fake logos, clutter, over-saturated highlights, illegible text",
  referenceNotes: "",
};
