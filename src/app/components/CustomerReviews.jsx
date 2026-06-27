"use client";

import { motion } from "framer-motion";
import { Star, Quote, MessageSquare } from "lucide-react";

export default function CustomerReviews({ reviews = [] }) {
  const visibleReviews = reviews.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#967bb6]">
            Community Signal
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
            User Reviews{" "}
            <span className="text-[#967bb6]">Live Feed</span>
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/45">
          {visibleReviews.length} recent signals
        </div>
      </div>

      {visibleReviews.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/45">
          No reviews yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleReviews.map((review, index) => (
            <motion.article
              key={review._id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group relative min-h-[270px] overflow-hidden rounded-3xl border border-white/10 bg-[#121322]/80 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60"
            >
              <Quote className="absolute right-5 top-5 text-white/10" size={56} />

              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#967bb6]/30 bg-[#967bb6]/15 text-[#dfcff4]">
                  <MessageSquare size={22} />
                </div>

                <div className="flex items-center gap-1 rounded-full border border-yellow-300/20 bg-yellow-400/10 px-3 py-1 text-yellow-200">
                  <Star size={15} fill="currentColor" />
                  <span className="text-sm font-black">
                    {review.rating || 0}/5
                  </span>
                </div>
              </div>

              <p className="line-clamp-5 text-sm leading-7 text-white/60">
                {review.comment || "No comment provided."}
              </p>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-black text-white">
                  {review.name || "Anonymous"}
                </p>
                <p className="mt-1 truncate text-sm text-white/35">
                  {review.email || "No email"}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}