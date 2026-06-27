"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { FileText, Copy, Bookmark, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

const parseJson = async (res) => {
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `Request failed with ${res.status}`);
  }

  return text ? JSON.parse(text) : null;
};

export default function CreatorDashboardHomePage() {
  const { data: session, isPending } = useSession();

  const [prompts, setPrompts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const user = session?.user;

  useEffect(() => {
    if (!user?.email) return;

    const loadDashboardData = async () => {
      try {
        setLoadingStats(true);

        const promptsRes = await fetch(
          `${API_URL}/api/prompts?creatorEmail=${user.email}`,
          {
            cache: "no-store",
          }
        );

        const promptsData = await parseJson(promptsRes);

        setPrompts(promptsData?.prompts || []);
      } catch (error) {
        console.error("Failed to load dashboard analytics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardData();
  }, [user?.email]);

  const totalCopies = useMemo(() => {
    return prompts.reduce(
      (sum, prompt) => sum + Number(prompt.copyCount || 0),
      0
    );
  }, [prompts]);

  const totalBookmarks = useMemo(() => {
    return prompts.reduce(
      (sum, prompt) =>
        sum + Number(prompt.bookmarkCount || prompt.bookmarks || 0),
      0
    );
  }, [prompts]);

  const promptGrowthData = useMemo(() => {
    const grouped = {};

    prompts.forEach((prompt) => {
      const date = prompt.createdAt
        ? new Date(prompt.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Unknown";

      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      prompts: count,
    }));
  }, [prompts]);

 const copyChartData = useMemo(() => {
  return prompts
    .map((prompt, index) => ({
      name: `Prompt ${index + 1}`,
      fullTitle: prompt.title || "Untitled",
      copies: Number(prompt.copyCount || 0),
    }))
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 8);
}, [prompts]);

  const statCards = [
    {
      title: "Total Prompts",
      value: prompts.length,
      icon: FileText,
      caption: "Created by you",
    },
    {
      title: "Total Copies",
      value: totalCopies.toLocaleString(),
      icon: Copy,
      caption: "Across all prompts",
    },
    {
      title: "Total Bookmarks",
      value: totalBookmarks,
      icon: Bookmark,
      caption: "Saved by users",
    },
    {
      title: "Prompt Growth",
      value: promptGrowthData.length,
      icon: TrendingUp,
      caption: "Active posting days",
    },
  ];

  if (isPending) {
    return (
      <div className="p-8 text-white">
        Loading futuristic dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <section className="max-w-7xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Creator Analytics
          </p>

          <h1 className="text-5xl font-black italic text-white">
            {user?.name || "Creator"}{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              HUB
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-white/50">
            Track your prompt performance, copy activity, bookmarks, and growth
            over time.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              stat={stat}
              loading={loadingStats}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <ChartPanel title="Total Copies" subtitle="Top copied prompts">
            {copyChartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={copyChartData}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(150,123,182,0.08)" }}
                    contentStyle={{
                      background: "#121322",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="copies"
                    fill="#967bb6"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartPanel>

          <ChartPanel title="Prompt Growth" subtitle="Prompts added by date">
            {promptGrowthData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={promptGrowthData}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#967bb6"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="95%"
                        stopColor="#967bb6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
  cursor={{ fill: "rgba(150,123,182,0.08)" }}
  formatter={(value) => [`${value} copies`, "Copies"]}
  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle || "Prompt"}
  contentStyle={{
    background: "#121322",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    color: "#fff",
  }}
/>
                  <Area
                    type="monotone"
                    dataKey="prompts"
                    stroke="#967bb6"
                    strokeWidth={3}
                    fill="url(#growthFill)"
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

function StatCard({ stat, loading }) {
  const Icon = stat.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6]/80 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#121322] text-[#cdb7e8]">
          <Icon size={22} />
        </div>

        <span className="rounded-full border border-[#967bb6]/20 bg-[#967bb6]/10 px-3 py-1 text-xs font-bold text-[#d8c6ef]">
          Live
        </span>
      </div>

      <p className="text-sm text-white/45">{stat.title}</p>

      <h3 className="mt-2 text-4xl font-black italic text-white">
        {loading ? "..." : stat.value}
      </h3>

      <p className="mt-2 text-sm text-white/35">{stat.caption}</p>
    </div>
  );
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/25">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#967bb6]">
          Analytics Chart
        </p>

        <h2 className="mt-2 text-3xl font-black italic text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-white/40">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121322]/80 p-4">
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