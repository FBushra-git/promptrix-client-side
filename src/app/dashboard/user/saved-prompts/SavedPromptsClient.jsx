"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { toggleBookmark } from "@/lib/actions/prompts";
import { Trash2, Eye } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

export default function SavedPromptsClient({ bookmarks = [], user }) {
  const [items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadPrompts = async () => {
      const results = await Promise.all(
        bookmarks.map(async (bookmark) => {
          try {
            const res = await fetch(`${API_URL}/api/prompts/${bookmark.promptId}`);
            if (!res.ok) return null;
            const prompt = await res.json();
            return { bookmark, prompt };
          } catch {
            return null;
          }
        })
      );

      setItems(results.filter(Boolean));
    };

    loadPrompts();
  }, [bookmarks]);

  const removeBookmark = (promptId) => {
    startTransition(async () => {
      await toggleBookmark({
        promptId,
        userEmail: user.email,
        userName: user.name,
      });

      setItems((prev) => prev.filter((item) => item.prompt._id !== promptId));
      toast.success("Bookmark removed");
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/45">
        No saved prompts yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map(({ prompt }) => (
        <article
          key={prompt._id}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20"
        >
          {prompt.thumbnail && (
            <img
              src={prompt.thumbnail}
              alt={prompt.title}
              className="h-44 w-full rounded-2xl object-cover"
            />
          )}

          <h2 className="mt-4 line-clamp-2 text-xl font-black">{prompt.title}</h2>

          <p className="mt-2 line-clamp-2 text-sm text-white/45">
            {prompt.description}
          </p>

          <div className="mt-5 flex gap-2">
            <Link
              href={`/dashboard/creator/prompts/${prompt._id}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#967bb6] px-4 py-2 text-sm font-black text-white"
            >
              <Eye size={15} />
              View Details
            </Link>

            <button
              disabled={isPending}
              onClick={() => removeBookmark(prompt._id)}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}