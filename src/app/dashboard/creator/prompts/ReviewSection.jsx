"use client";

export default function ReviewSection({ reviews = [] }) {
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
                  <h4 className="font-semibold text-white">{review.name}</h4>
                  <p className="break-all text-xs text-gray-400">
                    {review.email}
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