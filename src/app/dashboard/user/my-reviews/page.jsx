import { getUserReviews } from "@/lib/api/reviews";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth/signin");

  const reviews = await getUserReviews(session.user.email);
  const list = Array.isArray(reviews) ? reviews : [];

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
            Feedback Archive
          </p>
          <h1 className="mt-3 text-4xl font-black italic">My Reviews</h1>
          <p className="mt-2 text-white/45">All reviews submitted by you.</p>
        </div>

        <div className="grid gap-5">
          {list.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/45">
              You have not submitted any reviews yet.
            </div>
          ) : (
            list.map((review) => (
              <article
                key={review._id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-3 flex items-center gap-2 text-yellow-300">
                  <Star size={18} />
                  <span className="font-black">{review.rating}/5</span>
                </div>

                <p className="text-white/70">{review.comment}</p>

                <p className="mt-4 text-sm text-white/35">
                  Prompt ID: {review.promptId}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}