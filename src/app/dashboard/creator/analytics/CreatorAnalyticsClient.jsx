"use client";

import React, { useMemo } from "react";
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

export default function CreatorAnalyticsClient({
  user,
  prompts = [],
  bookmarks = [],
  reviews = [],
}) {
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
    .map((prompt, index) => ({
      name: `Prompt ${index + 1}`,
      fullTitle: prompt.title || "Untitled",
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
            {user?.name || "Creator"} · Track prompt growth, copies, bookmarks,
            and rating performance.
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
            {copyData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={copyData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    domain={[0, "dataMax + 1"]}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} copies`, "Copies"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullTitle || "Prompt"
                    }
                  />
                  <Bar dataKey="copies" fill="#967bb6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartPanel>

          <ChartPanel title="Prompt Growth" subtitle="Prompts added over time">
            {growthData.length === 0 ? (
              <EmptyChart />
            ) : (
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
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    domain={[0, "dataMax + 1"]}
                  />
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
            )}
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

function EmptyChart() {
  return (
    <div className="flex h-[320px] items-center justify-center text-center text-white/40">
      <div>
        <p className="text-lg font-bold text-white/60">No analytics yet</p>
        <p className="mt-1 text-sm">
          Add prompts and collect activity to populate this chart.
        </p>
      </div>
    </div>
  );
}