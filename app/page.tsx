"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clipboard,
  Download,
  FileJson,
  ImageIcon,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { composePrompts } from "@/lib/prompt-engine";
import {
  defaultPromptValues,
  promptSchema,
  type PromptFormValues,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

const tabs = ["Master", "Compact", "Structured", "DNA", "JSON"] as const;
type Tab = (typeof tabs)[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Master");
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    mode: "onChange",
    defaultValues: defaultPromptValues,
  });

  const values = form.watch();
  const outputs = useMemo(() => composePrompts(values), [values]);
  const activeOutput = outputForTab(outputs, activeTab);

  async function copyOutput() {
    await navigator.clipboard.writeText(activeOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function exportFile(kind: "txt" | "json") {
    const content = kind === "json" ? outputs.json : activeOutput;
    const blob = new Blob([content], {
      type: kind === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-atelier-${activeTab.toLowerCase()}.${kind}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function analyzeReference(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const max = 96;
      const ratio = image.width / image.height;
      canvas.width = ratio >= 1 ? max : Math.max(1, Math.round(max * ratio));
      canvas.height = ratio >= 1 ? Math.max(1, Math.round(max / ratio)) : max;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const swatches = context ? extractSwatches(context, canvas.width, canvas.height) : [];
      const notes = [
        `${file.name} (${file.type || "unknown type"})`,
        `${image.width}x${image.height}px, aspect ${ratio.toFixed(2)}:1`,
        swatches.length ? `dominant browser-sampled colors ${swatches.join(", ")}` : "",
        "Use as visual reference only; do not copy private marks, identities, or exact proprietary layout.",
      ]
        .filter(Boolean)
        .join("; ");
      form.setValue("referenceNotes", notes, { shouldDirty: true, shouldValidate: true });
    };
    image.src = url;
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-border bg-white/55 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Prompt composer only
            </div>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              Prompt Atelier
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A local workbench for stylistically deep, production-ready GPT Image 2 prompts.
              It never generates images and does not call the Images API.
            </p>
          </div>
          <Button variant="secondary" onClick={() => form.reset(defaultPromptValues)}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(360px,0.88fr)_minmax(520px,1.12fr)]">
          <section className="min-w-0 border border-border bg-white/62 p-4">
            <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
              <PromptSection title="Core Brief" open>
                <Field label="Subject">
                  <Textarea {...form.register("subject")} className="min-h-20" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Intent">
                    <Input {...form.register("intent")} />
                  </Field>
                  <Field label="Audience">
                    <Input {...form.register("audience")} />
                  </Field>
                </div>
              </PromptSection>

              <PromptSection title="Composition" open>
                <Field label="Composition">
                  <Textarea {...form.register("composition")} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Viewpoint">
                    <Input {...form.register("viewpoint")} />
                  </Field>
                  <Field label="Environment">
                    <Input {...form.register("environment")} />
                  </Field>
                </div>
              </PromptSection>

              <PromptSection title="Style System">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Style Domain">
                    <Input {...form.register("styleDomain")} />
                  </Field>
                  <Field label="Palette">
                    <Input {...form.register("palette")} />
                  </Field>
                </div>
                <Field label="Style Modifiers">
                  <Textarea {...form.register("styleModifiers")} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Lighting">
                    <Textarea {...form.register("lighting")} />
                  </Field>
                  <Field label="Materials">
                    <Textarea {...form.register("materials")} />
                  </Field>
                </div>
              </PromptSection>

              <PromptSection title="Technical Controls">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Size">
                    <Select {...form.register("size")}>
                      <option value="1024x1024">1024x1024</option>
                      <option value="1024x1536">1024x1536</option>
                      <option value="1536x1024">1536x1024</option>
                      <option value="auto">auto</option>
                    </Select>
                  </Field>
                  <Field label="Quality">
                    <Select {...form.register("quality")}>
                      <option value="high">high</option>
                      <option value="medium">medium</option>
                      <option value="low">low</option>
                      <option value="auto">auto</option>
                    </Select>
                  </Field>
                  <Field label="Format">
                    <Select {...form.register("outputFormat")}>
                      <option value="png">png</option>
                      <option value="webp">webp</option>
                      <option value="jpeg">jpeg</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Fidelity Priorities">
                  <Textarea {...form.register("fidelity")} />
                </Field>
                <Field label="Typography">
                  <Textarea {...form.register("typography")} />
                </Field>
              </PromptSection>

              <PromptSection title="Reference And Guardrails">
                <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-white/55 px-3 text-center text-sm text-muted-foreground">
                    <ImageIcon className="h-5 w-5" />
                    Reference upload for local analysis
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/*"
                      onChange={(event) => analyzeReference(event.target.files?.[0])}
                    />
                  </label>
                  <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Reference preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="px-3 text-center text-xs text-muted-foreground">
                        No image loaded
                      </span>
                    )}
                  </div>
                </div>
                <Field label="Reference Notes">
                  <Textarea {...form.register("referenceNotes")} />
                </Field>
                <Field label="Exclusions">
                  <Textarea {...form.register("exclusions")} />
                </Field>
              </PromptSection>
            </form>
          </section>

          <section className="min-w-0 border border-border bg-white/72">
            <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Prompt Quality
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-4xl font-semibold tabular-nums">{outputs.score}</div>
                  <div className="h-2 w-44 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-[hsl(var(--ring))] transition-all"
                      style={{ width: `${outputs.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={copyOutput}>
                  <Clipboard className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="secondary" onClick={() => exportFile("txt")}>
                  <Download className="h-4 w-4" />
                  TXT
                </Button>
                <Button variant="secondary" onClick={() => exportFile("json")}>
                  <FileJson className="h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="border-b border-border px-4 pt-3">
              <div className="flex flex-wrap gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "h-9 rounded-t-md border border-b-0 px-3 text-sm font-medium",
                      activeTab === tab
                        ? "border-border bg-background text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-[1fr_240px]">
              <pre className="min-h-[620px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-sm leading-7 text-foreground">
                {activeOutput}
              </pre>
              <aside className="space-y-3">
                <div className="rounded-md border border-border bg-background p-3">
                  <p className="text-sm font-semibold">Issue Hints</p>
                  {outputs.issues.length ? (
                    <ul className="mt-2 space-y-2 text-sm leading-5 text-muted-foreground">
                      {outputs.issues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      The prompt has strong subject, style, technical, and guardrail coverage.
                    </p>
                  )}
                </div>
                <div className="rounded-md border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
                  Output is composed locally in your browser. Reference uploads are not stored and no
                  image request is made.
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function PromptSection({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group rounded-md border border-border bg-background/65">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-semibold">
        {title}
        <span className="text-muted-foreground transition group-open:rotate-45">+</span>
      </summary>
      <div className="space-y-3 border-t border-border p-3">{children}</div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function outputForTab(outputs: ReturnType<typeof composePrompts>, tab: Tab) {
  switch (tab) {
    case "Master":
      return outputs.master;
    case "Compact":
      return outputs.compact;
    case "Structured":
      return outputs.structured;
    case "DNA":
      return outputs.dna;
    case "JSON":
      return outputs.json;
  }
}

function extractSwatches(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const data = context.getImageData(0, 0, width, height).data;
  const buckets = new Map<string, number>();
  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 128) continue;
    const r = Math.round(data[index] / 32) * 32;
    const g = Math.round(data[index + 1] / 32) * 32;
    const b = Math.round(data[index + 2] / 32) * 32;
    const key = rgbToHex(r, g, b);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color);
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"))
    .join("")}`;
}
