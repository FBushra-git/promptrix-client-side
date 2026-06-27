"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaRegBookmark,
  FaBookmark,
  FaRegCopy,
  FaRegStar,
  FaFlag,
} from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";

import {
  toggleBookmark,
  incrementCopyCount,
  submitReport,
} from "@/lib/actions/prompts";

import { createReview } from "@/lib/actions/reviews";

export default function PromptDetailsClient({
  prompt: initialPrompt,
  reviews: initialReviews = [],
  user,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [prompt, setPrompt] = useState(initialPrompt);
  const [reviews, setReviews] = useState(initialReviews);
  const [bookmarked, setBookmarked] = useState(
    Boolean(initialPrompt?.isBookmarked)
  );

  const [reportOpen, setReportOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [reportReason, setReportReason] = useState("Inappropriate Content");
  const [reportDescription, setReportDescription] = useState("");

  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const tags = Array.isArray(prompt?.tags)
    ? prompt.tags
    : prompt?.tags
      ? prompt.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const isPremiumPrompt = prompt?.isVisible === false;

  const userIsPremium =
    user?.subscription === "premium" ||
    user?.role === "premium" ||
    user?.isPremium;

  const canAccessPrompt = !isPremiumPrompt || userIsPremium;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const formatCopyCount = (count = 0) => {
    const number = Number(count || 0);
    if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
    return number;
  };

  const handleBookmark = () => {
    startTransition(async () => {
      const result = await toggleBookmark({
        promptId: prompt._id,
        userEmail: user.email,
        userName: user.name,
      });

      if (result?.success === false) {
        toast.error(result?.message || "Failed to update bookmark");
        return;
      }

      setBookmarked((prev) => !prev);
      toast.success(bookmarked ? "Bookmark removed" : "Prompt bookmarked");
    });
  };

  const handleCopy = async () => {
    if (!canAccessPrompt) {
      toast.error("Subscribe to Premium to copy this prompt");
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt.content || "");

      setPrompt((prev) => ({
        ...prev,
        copyCount: Number(prev.copyCount || 0) + 1,
      }));

      toast.success("Prompt copied");

      startTransition(async () => {
        await incrementCopyCount(prompt._id);
      });
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!canAccessPrompt) {
      toast.error("Subscribe to Premium to review this prompt");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    startTransition(async () => {
      const reviewData = {
        promptId: prompt._id,
        name: user.name,
        email: user.email,
        rating: Number(rating),
        comment: reviewComment,
        date: new Date().toISOString(),
      };

      const result = await createReview(reviewData);

      if (result?.success === false) {
        toast.error(result?.message || "Failed to submit review");
        return;
      }

      const savedReview = result?.review || result?.data || reviewData;

      setReviews((prev) => [
        {
          ...savedReview,
          _id: savedReview._id || Date.now().toString(),
        },
        ...prev,
      ]);

      toast.success("Review submitted");
      setReviewOpen(false);
      setRating(5);
      setReviewComment("");
      router.refresh();
    });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      const reportData = {
  promptId: prompt._id,
  promptTitle: prompt.title,

  creatorName: prompt.creatorName || "Unknown Creator",
  creatorEmail: prompt.creatorEmail || "",

  reporterName: user.name,
  reporterEmail: user.email,
  userEmail: user.email,

  reason: reportReason,
  description: reportDescription,
  status: "open",
  date: new Date().toISOString(),
};

      const result = await submitReport(reportData);

      if (result?.success === false) {
        toast.error(result?.message || "Failed to submit report");
        return;
      }

      toast.success("Report submitted");
      setReportOpen(false);
      setReportReason("Inappropriate Content");
      setReportDescription("");
    });
  };

  return (
    <div className="min-h-screen bg-[#121322] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap gap-3">
          <ActionButton onClick={handleBookmark} disabled={isPending}>
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </ActionButton>

          <ActionButton onClick={handleCopy} disabled={!canAccessPrompt}>
            <FaRegCopy />
            Copy ({formatCopyCount(prompt.copyCount)})
          </ActionButton>

          <ActionButton
            onClick={() => setReviewOpen(true)}
            disabled={!canAccessPrompt}
          >
            <FaRegStar />
            Star review
          </ActionButton>

          <button
            onClick={() => setReportOpen(true)}
            className="prompt-danger-btn"
          >
            <MdReportProblem />
            Report
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-[#292c43] bg-[#1e2032] shadow-xl">
              {prompt.thumbnail ? (
                <img
                  src={prompt.thumbnail}
                  alt={prompt.title || "Prompt thumbnail"}
                  className="h-64 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-[#121322] text-white/40">
                  No thumbnail
                </div>
              )}

              <div className="p-5">
                <h2 className="mb-4 text-xl font-bold">{prompt.title}</h2>

                <div className="mb-5">
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-400">
                    Tags
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {tags.length === 0 ? (
                      <span className="text-sm text-gray-400">No tags</span>
                    ) : (
                      tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[#30334d] px-3 py-1 text-sm"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-[#25283d] p-3">
                    <p className="text-gray-400">Copies</p>
                    <p className="font-semibold">
                      {formatCopyCount(prompt.copyCount)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#25283d] p-3">
                    <p className="text-gray-400">Difficulty</p>
                    <p className="font-semibold capitalize">
                      {prompt.difficulty || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#25283d] p-3">
                    <p className="text-gray-400">Visibility</p>
                    <p className="font-semibold">
                      {isPremiumPrompt ? "Private" : "Public"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#25283d] p-3">
                    <p className="text-gray-400">Rating</p>
                    <p className="font-semibold">★ {averageRating}</p>
                  </div>
                </div>
              </div>
            </div>

            <ReviewSection reviews={reviews} />
          </aside>

          <main className="rounded-lg border border-[#292c43] bg-[#1e2032] p-6 shadow-xl">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold leading-tight">
                  {prompt.title}
                </h1>

                {isPremiumPrompt && (
                  <span className="mt-3 inline-flex rounded-full border border-[#967bb6]/40 bg-[#967bb6]/20 px-3 py-1 text-xs font-bold text-[#dfcff4]">
                    Premium Prompt
                  </span>
                )}
              </div>
            </div>

            <InfoBlock title="Full Description">
              {prompt.description}
            </InfoBlock>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Prompt Content</h3>

              {canAccessPrompt ? (
                <div className="rounded-lg border border-[#35384f] bg-[#25283d] p-4">
                  <p className="whitespace-pre-line leading-relaxed text-gray-100">
                    {prompt.content}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-[#474b68] bg-[#25283d] p-5 text-center">
                  <p className="mb-4 select-none blur-sm">
                    {(prompt.content || "").slice(0, 220)}
                  </p>

                  <p className="mb-4 font-medium text-[#d8c6ef]">
                    This is a premium prompt. Subscribe to Premium to unlock full
                    content, copy, and review access.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        `/payment?redirect=${encodeURIComponent(
                          `/dashboard/creator/prompts/${prompt._id}`
                        )}`
                      )
                    }
                    className="prompt-submit-btn"
                  >
                    Subscribe to Premium ($5)
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoBlock title="Category">{prompt.category}</InfoBlock>
              <InfoBlock title="AI Tool Name">{prompt.aiTool}</InfoBlock>
              <InfoBlock title="Difficulty Level">
                {prompt.difficulty}
              </InfoBlock>
              <InfoBlock title="Status">{prompt.status}</InfoBlock>
              <InfoBlock title="Visibility">
                {isPremiumPrompt ? "Private / Premium" : "Public"}
              </InfoBlock>
              <InfoBlock title="Reviews">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </InfoBlock>
            </div>

            <InfoBlock title="Usage Instructions">
              {prompt.usageInstructions ||
                "Copy the prompt, paste it into the AI tool, and adjust details as needed."}
            </InfoBlock>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">
                Creator Information
              </h3>

              <div className="rounded-lg border border-[#35384f] bg-[#25283d] p-4">
                <p className="font-semibold text-white">
                  {prompt.creatorName || user?.name || "Unknown Creator"}
                </p>
                <p className="text-sm text-gray-400">
                  {prompt.creatorEmail || user?.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="border-t border-[#35384f] pt-5">
              <h3 className="mb-2 text-lg font-semibold">Copy Count</h3>
              <div className="flex items-center gap-2 text-gray-100">
                <FaRegCopy />
                <span>{formatCopyCount(prompt.copyCount)} copies</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <ActionButton onClick={handleCopy} disabled={!canAccessPrompt}>
                <FaRegCopy />
                Copy ({formatCopyCount(prompt.copyCount)})
              </ActionButton>

              <ActionButton
                onClick={() => setReviewOpen(true)}
                disabled={!canAccessPrompt}
              >
                <FaRegStar />
                Star review
              </ActionButton>

              <button
                onClick={() => setReportOpen(true)}
                className="prompt-danger-btn px-5 py-2"
              >
                <FaFlag />
                Report
              </button>
            </div>
          </main>
        </div>
      </div>

      {reportOpen && (
        <Modal onClose={() => setReportOpen(false)}>
          <h2 className="mb-4 text-lg font-semibold">Report Prompt</h2>

          <form onSubmit={handleReportSubmit}>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="mb-3 w-full rounded-lg border border-[#626681] bg-[#2b2e49] px-3 py-2 text-white outline-none"
            >
              <option>Inappropriate Content</option>
              <option>Spam</option>
              <option>Copyright Violation</option>
            </select>

            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Optional Description"
              rows={4}
              className="mb-5 w-full resize-none rounded-lg border border-[#626681] bg-[#2b2e49] px-3 py-2 text-white outline-none placeholder:text-gray-400"
            />

            <ModalActions onCancel={() => setReportOpen(false)}>
              Submit Report
            </ModalActions>
          </form>
        </Modal>
      )}

      {reviewOpen && (
        <Modal onClose={() => setReviewOpen(false)}>
          <h2 className="mb-4 text-lg font-semibold">Star Review</h2>

          {!canAccessPrompt ? (
            <div className="rounded-lg border border-[#626681] bg-[#2b2e49] p-4 text-sm text-gray-300">
              Reviews are disabled for premium locked prompts. Subscribe to
              Premium to submit a review.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mb-3 w-full rounded-lg border border-[#626681] bg-[#2b2e49] px-3 py-2 text-white outline-none"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review"
                required
                rows={4}
                className="mb-5 w-full resize-none rounded-lg border border-[#626681] bg-[#2b2e49] px-3 py-2 text-white outline-none placeholder:text-gray-400"
              />

              <ModalActions onCancel={() => setReviewOpen(false)}>
                Submit Review
              </ModalActions>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

function ReviewSection({ reviews = [] }) {
  return (
    <div className="rounded-lg border border-[#292c43] bg-[#1e2032] p-5 shadow-xl">
      <h2 className="mb-4 text-xl font-bold text-white">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet for this prompt.</p>
      ) : (
        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
          {reviews.map((review, index) => (
            <div
              key={review._id || index}
              className="rounded-lg border border-[#35384f] bg-[#25283d] p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white">
                    {review.name || "Anonymous"}
                  </h4>
                  <p className="break-all text-xs text-gray-400">
                    {review.email || "No email"}
                  </p>
                </div>

                <span className="rounded-md bg-[#30334d] px-2 py-1 text-sm text-yellow-400">
                  {"★".repeat(Number(review.rating || 0))}
                </span>
              </div>

              <p className="mb-2 text-sm text-gray-100">{review.comment}</p>

              <p className="text-xs text-gray-500">
                {review.date
                  ? new Date(review.date).toLocaleDateString()
                  : "No date"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="whitespace-pre-line leading-relaxed text-gray-100">
        {children || "N/A"}
      </p>
    </div>
  );
}

function ActionButton({ children, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} className="prompt-action-btn">
      {children}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-[#474b68] bg-[#2a2d46] p-5 text-white shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}

function ModalActions({ children, onCancel }) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-5 py-2 text-white hover:bg-[#343754]"
      >
        Cancel
      </button>

      <button type="submit" className="prompt-submit-btn">
        {children}
      </button>
    </div>
  );
}