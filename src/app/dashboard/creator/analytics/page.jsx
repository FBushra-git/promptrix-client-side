"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Copy, FileText, Bookmark, Star } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

const parseJson = async (res) => {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed with ${res.status}`);
  return JSON.parse(text);
};

export default function CreatorAnalyticsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [prompts, setPrompts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [promptsRes, bookmarksRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/api/prompts?creatorEmail=${user.email}`),
          fetch(`${API_URL}/api/bookmarks`),
          fetch(`${API_URL}/api/reviews`),
        ]);

        const promptsData = await parseJson(promptsRes);
        const bookmarksData = await parseJson(bookmarksRes);
        const reviewsData = await parseJson(reviewsRes);

        setPrompts(promptsData?.prompts || []);
        setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error("Analytics load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.email]);

  const promptIds = useMemo(
    () => prompts.map((prompt) => String(prompt._id)),
    [prompts]
  );

  const creatorBookmarks = useMemo(
    () => bookmarks.filter((item) => promptIds.includes(String(item.promptId))),
    [bookmarks, promptIds]
  );

  const creatorReviews = useMemo(
    () => reviews.filter((item) => promptIds.includes(String(item.promptId))),
    [reviews, promptIds]
  );

  const totalCopies = prompts.reduce(
    (sum, prompt) => sum + Number(prompt.copyCount || 0),
    0
  );

  const avgRating =
    creatorReviews.length > 0
      ? (
          creatorReviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / creatorReviews.length
        ).toFixed(1)
      : "0.0";

  const copyData = prompts
    .map((prompt) => ({
      name:
        prompt.title?.length > 16
          ? `${prompt.title.slice(0, 16)}...`
          : prompt.title || "Untitled",
      copies: Number(prompt.copyCount || 0),
    }))
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 8);

  const growthData = Object.entries(
    prompts.reduce((acc, prompt) => {
      const date = prompt.createdAt
        ? new Date(prompt.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Unknown";

      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, prompts: count }));

  if (isPending) return <p className="p-8 text-white">Loading analytics...</p>;

  return (
    <main className="p-8 text-white">
      <section className="max-w-7xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Creator Analytics
          </p>

          <h1 className="text-5xl font-black italic">
            Performance{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mt-3 text-white/50">
            Track prompt growth, copies, bookmarks, and rating performance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileText} label="Total Prompts" value={prompts.length} />
          <StatCard icon={Copy} label="Total Copies" value={totalCopies} />
          <StatCard icon={Bookmark} label="Bookmarks" value={creatorBookmarks.length} />
          <StatCard icon={Star} label="Avg Rating" value={avgRating} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel title="Total Copies" subtitle="Most copied prompts">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={copyData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="copies" fill="#967bb6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Prompt Growth" subtitle="Prompts added over time">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#967bb6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#967bb6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="prompts"
                  stroke="#967bb6"
                  strokeWidth={3}
                  fill="url(#growth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>
    </main>
  );
}

const tooltipStyle = {
  background: "#121322",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  color: "#fff",
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#967bb6]/15 text-[#d8c6ef]">
        <Icon size={22} />
      </div>
      <p className="text-sm text-white/45">{label}</p>
      <h2 className="mt-2 text-4xl font-black italic">{value}</h2>
    </div>
  );
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/25">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
        Analytics Chart
      </p>
      <h2 className="mt-2 text-3xl font-black italic">{title}</h2>
      <p className="mt-1 text-sm text-white/40">{subtitle}</p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#121322]/80 p-4">
        {children}
      </div>
    </div>
  );
}