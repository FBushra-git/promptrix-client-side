"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  updatePromptStatus,
  toggleFeaturePrompt,
  deletePromptByAdmin,
} from "@/lib/actions/admin";
import { Check, X, Trash2, Sparkles } from "lucide-react";

export default function AdminPromptsTable({ prompts = [] }) {
  const router = useRouter();

  const [loading, setLoading] = useState("");
  const [rejectPrompt, setRejectPrompt] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  const approve = async (id) => {
    setLoading(id);

    try {
      const result = await updatePromptStatus(id, { status: "approved" });

      if (!result?.success) {
        throw new Error("Approval failed");
      }

      toast.success("Prompt approved");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Approval failed");
    } finally {
      setLoading("");
    }
  };

  const confirmReject = async () => {
    if (!rejectPrompt?._id) return;

    if (!rejectionFeedback.trim()) {
      toast.error("Please write rejection feedback");
      return;
    }

    setLoading(rejectPrompt._id);

    try {
      const result = await updatePromptStatus(rejectPrompt._id, {
        status: "rejected",
        rejectionFeedback,
      });

      if (!result?.success) {
        throw new Error("Rejection failed");
      }

      toast.success("Prompt rejected");
      setRejectPrompt(null);
      setRejectionFeedback("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Rejection failed");
    } finally {
      setLoading("");
    }
  };

  const feature = async (id, current) => {
    setLoading(id);

    try {
      const result = await toggleFeaturePrompt(id, !current);

      if (!result?.success) {
        throw new Error("Feature update failed");
      }

      toast.success(!current ? "Prompt featured" : "Prompt unfeatured");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Feature update failed");
    } finally {
      setLoading("");
    }
  };

  const confirmDelete = async () => {
    if (!deletePrompt?._id) return;

    setLoading(deletePrompt._id);

    try {
      const result = await deletePromptByAdmin(deletePrompt._id);

      if (!result?.success) {
        throw new Error("Delete failed");
      }

      toast.success("Prompt deleted");
      setDeletePrompt(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <div className="grid gap-5">
        {prompts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/45">
            No prompts found.
          </div>
        ) : (
          prompts.map((prompt) => {
            const status = prompt.status || "pending";
            const isApproved = status === "approved";
            const isRejected = status === "rejected";
            const isLoading = loading === prompt._id;

            return (
              <article
                key={prompt._id}
                className={`grid gap-5 rounded-3xl border p-5 shadow-xl shadow-black/20 transition lg:grid-cols-[180px_1fr_auto] ${
                  isApproved
                    ? "border-emerald-400/30 bg-emerald-400/[0.045]"
                    : "border-white/10 bg-white/[0.04] hover:border-[#967bb6]/40"
                }`}
              >
                <div className="h-40 overflow-hidden rounded-2xl border border-white/10 bg-[#121322]">
                  {prompt.thumbnail ? (
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title || "Prompt thumbnail"}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/30">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatusBadge status={status} />
                    <Badge>{prompt.isVisible ? "visible" : "hidden"}</Badge>
                    {prompt.featured && <Badge>featured</Badge>}
                  </div>

                  <h2 className="text-2xl font-black">{prompt.title}</h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">
                    {prompt.description || "No description"}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                    <Info
                      label="Creator"
                      value={
                        prompt.creatorName ||
                        prompt.creatorEmail ||
                        "Unknown Creator"
                      }
                    />
                    <Info label="Category" value={prompt.category || "N/A"} />
                    <Info label="AI Tool" value={prompt.aiTool || "N/A"} />
                    <Info label="Copies" value={prompt.copyCount || 0} />
                  </div>

                  {prompt.rejectionFeedback && (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-red-300">
                        Rejection Feedback
                      </p>
                      <p className="mt-1 text-sm text-red-100">
                        {prompt.rejectionFeedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row flex-wrap gap-2 lg:w-36 lg:flex-col">
                  {!isApproved && (
                    <Action
                      disabled={isLoading}
                      onClick={() => approve(prompt._id)}
                      icon={Check}
                      label="Approve"
                      tone="success"
                    />
                  )}

                  {isApproved && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-400/20 px-4 py-2 text-sm font-black text-emerald-100 shadow-lg shadow-emerald-500/10">
                      <Check size={15} />
                      Approved
                    </div>
                  )}

                  {!isRejected && !isApproved && (
                    <Action
                      disabled={isLoading}
                      onClick={() => {
                        setRejectPrompt(prompt);
                        setRejectionFeedback("");
                      }}
                      icon={X}
                      label="Reject"
                      tone="warning"
                    />
                  )}

                  {isRejected && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm font-black text-red-100">
                      <X size={15} />
                      Rejected
                    </div>
                  )}

                  <Action
                    disabled={isLoading}
                    onClick={() => feature(prompt._id, prompt.featured)}
                    icon={Sparkles}
                    label={prompt.featured ? "Unfeature" : "Feature"}
                  />

                  <Action
                    danger
                    disabled={isLoading}
                    onClick={() => setDeletePrompt(prompt)}
                    icon={Trash2}
                    label="Delete"
                  />
                </div>
              </article>
            );
          })
        )}
      </div>

      {rejectPrompt && (
        <Modal onClose={() => setRejectPrompt(null)}>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#967bb6]">
            Reject Prompt
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {rejectPrompt.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Give the creator a clear reason. This feedback will be saved with
            the prompt.
          </p>

          <textarea
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
            rows={5}
            placeholder="Example: This prompt contains unsafe or low-quality content..."
            className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-[#121322] p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#967bb6]"
          />

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectPrompt(null)}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmReject}
              disabled={loading === rejectPrompt._id}
              className="rounded-xl bg-gradient-to-r from-red-500 to-[#967bb6] px-5 py-2 text-sm font-black text-white transition hover:scale-[1.02] disabled:opacity-50"
            >
              Submit Rejection
            </button>
          </div>
        </Modal>
      )}

      {deletePrompt && (
        <Modal onClose={() => setDeletePrompt(null)}>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">
            Delete Prompt
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {deletePrompt.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/45">
            This will permanently remove this prompt from the database.
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeletePrompt(null)}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={loading === deletePrompt._id}
              className="rounded-xl bg-red-500 px-5 py-2 text-sm font-black text-white transition hover:bg-red-400 disabled:opacity-50"
            >
              Delete Prompt
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-[#967bb6]/30 bg-[#967bb6]/15 px-3 py-1 text-xs font-bold uppercase text-[#dfcff4]">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="rounded-full border border-emerald-300/50 bg-emerald-400/20 px-4 py-1 text-xs font-black uppercase tracking-widest text-emerald-100 shadow-lg shadow-emerald-500/10">
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-full border border-red-300/40 bg-red-500/15 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-100">
        Rejected
      </span>
    );
  }

  return (
    <span className="rounded-full border border-yellow-300/40 bg-yellow-400/15 px-4 py-1 text-xs font-black uppercase tracking-widest text-yellow-100">
      Pending
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121322] p-3">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-1 truncate font-bold text-white/75">{value}</p>
    </div>
  );
}

function Action({
  icon: Icon,
  label,
  onClick,
  danger = false,
  disabled = false,
  tone,
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
      : tone === "warning"
        ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-100 hover:bg-yellow-400/20"
        : danger
          ? "border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          : "border-white/10 bg-[#121322] text-white/75 hover:border-[#967bb6]/60 hover:text-white";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#1e2032] p-6 shadow-2xl shadow-black/40"
      >
        {children}
      </div>
    </div>
  );
}