"use client";

import React, { useState } from "react";
import { Chip, Button } from "@heroui/react";
import {
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  BarChart3,
  LayoutGrid,
  List,
  Eye as ViewIcon,
  Copy,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

export default function PromptTable({ prompts = [], currentUser }) {
  const [viewMode, setViewMode] = useState("table");
  const router = useRouter();

  const isOwner = (prompt) => {
    return prompt.creatorEmail === currentUser?.email;
  };

  const handleAction = async (action, prompt) => {
    const id = prompt?._id;

    switch (action) {
      case "delete": {
        if (!isOwner(prompt)) {
          toast.error("Only the creator can delete this prompt");
          return;
        }

        if (!confirm("Are you sure you want to delete this prompt?")) return;

        try {
          const res = await fetch(
            `${API_URL}/api/prompts/${id}?email=${encodeURIComponent(
              currentUser?.email || ""
            )}`,
            {
              method: "DELETE",
            }
          );

          if (!res.ok) {
            const text = await res.text();
            console.error("Server Error Response:", text);
            toast.error("Failed to delete prompt");
            return;
          }

          toast.success("Prompt deleted");
          window.location.reload();
        } catch (error) {
          console.error(error);
          toast.error("Delete failed");
        }

        break;
      }

      case "view":
        router.push(`/dashboard/creator/prompts/${id}`);
        break;

      case "analytics":
        router.push(`/dashboard/creator/analytics/${id}`);
        break;

      case "edit":
        if (!isOwner(prompt)) {
          toast.error("Only the creator can edit this prompt");
          return;
        }

        router.push(`/dashboard/creator/prompts/${id}/edit`);
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
            Prompt Inventory
          </p>

          <h2 className="mt-1 text-2xl font-black italic text-white">
            {prompts.length} Prompt{prompts.length === 1 ? "" : "s"}
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === "table" ? "flat" : "light"}
            onClick={() => setViewMode("table")}
            startContent={<List size={16} />}
            className="text-white"
          >
            List
          </Button>

          <Button
            size="sm"
            variant={viewMode === "grid" ? "flat" : "light"}
            onClick={() => setViewMode("grid")}
            startContent={<LayoutGrid size={16} />}
            className="text-white"
          >
            Grid
          </Button>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
          <h3 className="text-2xl font-bold text-white">No prompts yet</h3>

          <p className="mt-2 text-white/45">
            Add your first prompt to see it here.
          </p>

          <Button
            className="mt-6 bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] font-bold text-white"
            onClick={() => router.push("/dashboard/creator/prompts/add-prompt")}
          >
            Add Prompt
          </Button>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-white">
              <thead className="border-b border-white/10 bg-[#121322]/80 text-xs uppercase tracking-widest text-white/45">
                <tr>
                  <th className="p-4">Prompt</th>
                  <th className="p-4">AI Tool</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Copies</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {prompts.map((prompt) => {
                  const owner = isOwner(prompt);

                  return (
                    <tr
                      key={prompt._id}
                      className="transition hover:bg-white/[0.04]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Thumbnail prompt={prompt} size="sm" />

                          <div>
                            <p className="max-w-[280px] truncate font-bold">
                              {prompt.title}
                            </p>

                            <p className="text-xs capitalize text-white/40">
                              {prompt.category || "Uncategorized"} ·{" "}
                              {prompt.difficulty || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-sm text-white/70">
                        {prompt.aiTool || "N/A"}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/70">
                          {prompt.isVisible ? (
                            <>
                              <Eye size={16} className="text-emerald-400" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} className="text-[#967bb6]" />
                              Private
                            </>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <Chip
                          size="sm"
                          color={
                            prompt.status === "approved"
                              ? "success"
                              : "warning"
                          }
                          variant="flat"
                        >
                          {prompt.status || "pending"}
                        </Chip>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/70">
                          <Copy size={15} />
                          {prompt.copyCount || 0}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/70">
                          <Star size={15} />
                          {prompt.rating || "N/A"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            onClick={() => handleAction("view", prompt)}
                          >
                            <ViewIcon size={16} />
                          </ActionButton>

                          <ActionButton
                            onClick={() => handleAction("analytics", prompt)}
                          >
                            <BarChart3 size={16} />
                          </ActionButton>

                          {owner && (
                            <>
                              <ActionButton
                                onClick={() => handleAction("edit", prompt)}
                              >
                                <Edit2 size={16} />
                              </ActionButton>

                              <ActionButton
                                danger
                                onClick={() => handleAction("delete", prompt)}
                              >
                                <Trash2 size={16} />
                              </ActionButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => {
            const owner = isOwner(prompt);

            return (
              <div
                key={prompt._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/70"
              >
                <Thumbnail prompt={prompt} size="lg" />

                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Chip
                      size="sm"
                      color={
                        prompt.status === "approved" ? "success" : "warning"
                      }
                      variant="flat"
                    >
                      {prompt.status || "pending"}
                    </Chip>

                    <span className="text-xs text-white/40">
                      {prompt.copyCount || 0} copies
                    </span>
                  </div>

                  <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-black text-white">
                    {prompt.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-white/50">
                    {prompt.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="flex-1 font-bold text-white"
                      onClick={() => handleAction("view", prompt)}
                    >
                      View
                    </Button>

                    {owner && (
                      <>
                        <Button
                          size="sm"
                          variant="flat"
                          className="font-bold text-white"
                          onClick={() => handleAction("edit", prompt)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onClick={() => handleAction("delete", prompt)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Thumbnail({ prompt, size }) {
  const className =
    size === "sm" ? "h-12 w-16 rounded-xl" : "h-44 w-full rounded-2xl";

  if (!prompt.thumbnail) {
    return (
      <div
        className={`${className} flex items-center justify-center border border-white/10 bg-[#121322] text-xs text-white/35`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={prompt.thumbnail}
      alt={prompt.title || "Prompt thumbnail"}
      className={`${className} object-cover`}
      referrerPolicy="no-referrer"
    />
  );
}

function ActionButton({ children, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-2 transition ${
        danger
          ? "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          : "border-white/10 bg-white/5 text-white/65 hover:border-[#967bb6]/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}