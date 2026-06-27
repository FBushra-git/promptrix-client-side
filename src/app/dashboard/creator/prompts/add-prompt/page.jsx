"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { createPrompt } from "@/lib/actions/prompts";
import { getPrompts } from "@/lib/api/prompts";

export default function PromptForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [visibility, setVisibility] = useState("Public");
  const [creatorPromptCount, setCreatorPromptCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = session?.user;
  const isPremium = user?.isPremium || user?.subscription === "premium";
  const creatorLimit = 3;
  const hasReachedCreatorLimit =
    creatorPromptCount !== null && !isPremium && creatorPromptCount >= creatorLimit;

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#121322] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#967bb6] focus:ring-2 focus:ring-[#967bb6]/20";

  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45";

  useEffect(() => {
    const fetchCreatorPromptCount = async () => {
      if (!user?.email) return;

      try {
        const result = await getPrompts({
          creatorEmail: user.email,
          page: 1,
          perPage: 1,
        });

        setCreatorPromptCount(result?.total ?? 0);
      } catch (error) {
        console.error("Failed to load creator prompt count:", error);
      }
    };

    fetchCreatorPromptCount();
  }, [user?.email]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("Form data:", data);
    console.log("User:", user);
    console.log(
      "ImgBB key exists:",
      Boolean(process.env.NEXT_PUBLIC_IMGBB_API_KEY),
    );

    if (!user?.email) {
      toast.error("You must be logged in to submit a prompt.");
      return;
    }

    if (hasReachedCreatorLimit) {
      toast.error(
        "Free users can add only 3 prompts. Upgrade to Premium to add more."
      );
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_IMGBB_API_KEY) {
      toast.error("ImgBB API key is missing.");
      return;
    }

    setIsLoading(true);

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        },
      );

      const imgData = await imgRes.json();
      console.log("ImgBB response:", imgData);

      if (!imgData.success) {
        throw new Error(imgData?.error?.message || "Image upload failed");
      }

      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        content: data.content,
        aiTool: data.aiTool,
        difficulty: data.difficulty,
        tags: data.tags,

        creatorId: user.id || user._id || user.email,
        creatorEmail: user.email,
        creatorName: user.name,

        thumbnail: imgData.data.url,
        copyCount: 0,

        // Admin approval gate
        status: "pending",
        isVisible: visibility === "Public",
        featured: false,
      };

      console.log("Final payload:", payload);

      const res = await createPrompt(payload);
      console.log("Create prompt response:", res);

      if (res?.success || res?.insertedId || res?.acknowledged) {
        toast.success("Prompt posted successfully!");

        setImageFile(null);
        setImagePreview(null);
        setVisibility("Public");
        form.reset();

        router.replace("/dashboard/creator/prompts");
        router.refresh();
        return;
      }

      throw new Error("Backend did not confirm prompt creation.");
    } catch (error) {
      console.error("Prompt submit failed:", error);
      toast.error(error.message || "Failed to submit prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] px-4 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

          <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
              Creator Studio
            </p>

            <h1 className="text-4xl font-black italic md:text-5xl">
              Add New{" "}
              <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
                Prompt
              </span>
            </h1>

            <p className="max-w-2xl text-white/50">
              Publish a polished AI prompt with category, tags, difficulty,
              thumbnail, and visibility settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Prompt Title">
                <input
                  name="title"
                  required
                  placeholder="Example: Cinematic Cyberpunk Portrait"
                  className={inputClass}
                />
              </Field>

              <Field label="Category">
                <select name="category" required className={inputClass}>
                  <option value="">Select category</option>
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
                placeholder="Write a short, clear description of what this prompt does."
                className={inputClass}
              />
            </Field>

            <Field label="Prompt Content">
              <textarea
                name="content"
                required
                rows={8}
                placeholder="Paste the full prompt content here..."
                className={inputClass}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="AI Tool">
                <input
                  name="aiTool"
                  required
                  placeholder="Example: Claude, ChatGPT, Midjourney v6"
                  className={inputClass}
                />
              </Field>

              <Field label="Difficulty Level">
                <select name="difficulty" required className={inputClass}>
                  <option value="">Select difficulty</option>
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
                placeholder="react, hooks, optimization, performance"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-white/35">
                Separate tags with commas.
              </p>
            </Field>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <label className={labelClass}>Thumbnail Image</label>

                <label className="group relative flex h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-[#121322] transition hover:border-[#967bb6]/70 hover:bg-[#17182b]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                        +
                      </div>
                      <p className="font-semibold text-white">
                        Upload Thumbnail
                      </p>
                      <p className="mt-1 text-sm text-white/40">
                        PNG, JPG, or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>Visibility Status</label>

                <div className="grid gap-4">
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
                      <p className="font-bold text-white">{option}</p>
                      <p className="mt-1 text-sm text-white/45">
                        {option === "Public"
                          ? "Visible to everyone on the prompts page."
                          : "Premium users can unlock this prompt."}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-[#121322]/70 p-5">
                  <p className="text-sm font-semibold text-white">
                    Creator Info
                  </p>
                  <p className="mt-2 text-sm text-white/45">
                    {user?.name || "Unknown creator"}
                  </p>
                  <p className="mt-1 break-all text-xs text-white/35">
                    {user?.email || "No email found"}
                  </p>
                </div>
              </div>
            </div>

            {hasReachedCreatorLimit ? (
              <div className="space-y-4">
                <div className="mb-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  Free users can add only <strong>3 prompts</strong>.
                  Upgrade to Premium to add more.
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/payment?redirect=/dashboard/creator/prompts`)}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#967bb6] to-[#8a96ce] text-base font-bold text-white shadow-md"
                  >
                    Upgrade to Premium
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/creator')}
                    className="flex-1 h-12 rounded-xl border border-white/10 bg-transparent text-base font-bold text-white/70"
                  >
                    Manage Prompts
                  </button>
                </div>
              </div>
            ) : (
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="h-13 w-full rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] text-base font-bold text-white shadow-lg shadow-[#967bb6]/20 transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading
                  ? "Uploading thumbnail and saving prompt..."
                  : "Submit for Approval"}
              </Button>
            )}
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
