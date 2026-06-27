"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { updatePrompt } from "@/lib/actions/prompts";

export default function EditPromptForm({ prompt, user }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [visibility, setVisibility] = useState(
    prompt.isVisible === false ? "Private" : "Public"
  );

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#121322] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#967bb6] focus:ring-2 focus:ring-[#967bb6]/20";

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    startTransition(async () => {
      const result = await updatePrompt(prompt._id, {
        ...data,
        requesterEmail: user.email,
        isVisible: visibility === "Public",
      });

      if (result?.modifiedCount || result?.success || result?.acknowledged) {
        toast.success("Prompt updated successfully");
        router.push(`/dashboard/creator/prompts/${prompt._id}`);
        router.refresh();
        return;
      }

      toast.error("No changes were saved");
    });
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] px-4 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
              Creator Studio
            </p>

            <h1 className="mt-2 text-4xl font-black italic">
              Edit{" "}
              <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
                Prompt
              </span>
            </h1>

            <p className="mt-2 text-white/45">
              Update your prompt details, metadata, and visibility.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Prompt Title">
                <input
                  name="title"
                  required
                  defaultValue={prompt.title}
                  className={inputClass}
                />
              </Field>

              <Field label="Category">
                <select
                  name="category"
                  required
                  defaultValue={prompt.category}
                  className={inputClass}
                >
                  <option value="art">Art & Design</option>
                  <option value="coding">Coding</option>
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                </select>
              </Field>
            </div>

            <Field label="Short Description">
              <textarea
                name="description"
                required
                rows={3}
                defaultValue={prompt.description}
                className={inputClass}
              />
            </Field>

            <Field label="Prompt Content">
              <textarea
                name="content"
                required
                rows={8}
                defaultValue={prompt.content}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="AI Tool">
                <input
                  name="aiTool"
                  required
                  defaultValue={prompt.aiTool}
                  className={inputClass}
                />
              </Field>

              <Field label="Difficulty Level">
                <select
                  name="difficulty"
                  required
                  defaultValue={prompt.difficulty}
                  className={inputClass}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="pro">Pro</option>
                </select>
              </Field>
            </div>

            <Field label="Tags">
              <input
                name="tags"
                required
                defaultValue={prompt.tags}
                className={inputClass}
              />
            </Field>

            <Field label="Thumbnail URL">
              <input
                name="thumbnail"
                required
                defaultValue={prompt.thumbnail}
                className={inputClass}
              />
            </Field>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Visibility Status
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                {["Public", "Private"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setVisibility(option)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      visibility === option
                        ? "border-[#967bb6] bg-[#967bb6]/15 shadow-lg shadow-[#967bb6]/10"
                        : "border-white/10 bg-[#121322] hover:border-white/20"
                    }`}
                  >
                    <p className="font-bold">{option}</p>
                    <p className="mt-1 text-sm text-white/45">
                      {option === "Public"
                        ? "Visible on public prompt pages."
                        : "Locked for premium users only."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                isLoading={isPending}
                className="h-12 flex-1 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] font-bold text-white"
              >
                Save Changes
              </Button>

              <Button
                type="button"
                variant="flat"
                className="h-12 flex-1 rounded-xl font-bold text-white"
                onClick={() => router.push(`/dashboard/creator/prompts/${prompt._id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </label>
      {children}
    </div>
  );
}