"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, FileText, Star, Copy, Crown, Sparkles } from "lucide-react";

const lavender = "#967bb6";
const blue = "#8a96ce";
const pink = "#d946ef";
const cyan = "#22d3ee";
const emerald = "#34d399";
const yellow = "#facc15";
const red = "#fb7185";

export default function AdminAnalyticsCharts({
  stats = {},
  prompts = [],
  users = [],
  payments = [],
}) {
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const premiumUsers = users.filter((user) => user.isPremium).length;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers || users.length || 0,
      icon: Users,
      color: lavender,
      detail: `${premiumUsers} premium`,
    },
    {
      label: "Total Prompts",
      value: stats.totalPrompts || prompts.length || 0,
      icon: FileText,
      color: blue,
      detail: `${countByStatus(prompts, "pending")} pending`,
    },
    {
      label: "Total Reviews",
      value: stats.totalReviews || 0,
      icon: Star,
      color: yellow,
      detail: "Community feedback",
    },
    {
      label: "Total Copies",
      value: stats.totalCopies || getTotalCopies(prompts),
      icon: Copy,
      color: cyan,
      detail: "Prompt usage",
    },
  ];

  const promptStatusData = [
    { name: "Approved", value: countByStatus(prompts, "approved"), color: emerald },
    { name: "Pending", value: countByStatus(prompts, "pending"), color: yellow },
    { name: "Rejected", value: countByStatus(prompts, "rejected"), color: red },
  ];

  const categoryData = Object.entries(
    prompts.reduce((acc, prompt) => {
      const key = prompt.category || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const copiesByTool = Object.entries(
    prompts.reduce((acc, prompt) => {
      const key = prompt.aiTool || "Unknown";
      acc[key] = (acc[key] || 0) + Number(prompt.copyCount || 0);
      return acc;
    }, {})
  )
    .map(([name, copies]) => ({ name, copies }))
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 8);

  const growthData = buildGrowthData(prompts);

  const revenueData = buildRevenueData(payments);

  const topPrompts = [...prompts]
    .sort((a, b) => Number(b.copyCount || 0) - Number(a.copyCount || 0))
    .slice(0, 6)
    .map((prompt) => ({
      name: truncate(prompt.title || "Untitled", 20),
      copies: Number(prompt.copyCount || 0),
      status: prompt.status || "pending",
    }));

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121322] p-6 shadow-xl shadow-black/20"
          >
            <div
              className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125"
              style={{ backgroundColor: `${card.color}35` }}
            />

            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
              style={{ backgroundColor: `${card.color}18`, color: card.color }}
            >
              <card.icon size={24} />
            </div>

            <p className="mt-6 text-sm text-white/45">{card.label}</p>

            <h2 className="mt-2 text-5xl font-black">
              {Number(card.value || 0).toLocaleString()}
            </h2>

            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/30">
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartPanel
          eyebrow="Prompt Velocity"
          title="Prompt Growth"
          subtitle="New prompt submissions over time"
        >
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={growthData}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lavender} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={lavender} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />

              <Area
                type="monotone"
                dataKey="prompts"
                fill="url(#growthFill)"
                stroke={lavender}
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="approved"
                stroke={emerald}
                strokeWidth={3}
                dot={{ r: 4, fill: emerald, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          eyebrow="Review Gate"
          title="Prompt Status"
          subtitle="Approval queue health"
        >
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={promptStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={78}
                outerRadius={120}
                paddingAngle={6}
              >
                {promptStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-[-40px] grid grid-cols-3 gap-2">
            {promptStatusData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                <p className="text-2xl font-black" style={{ color: item.color }}>
                  {item.value}
                </p>
                <p className="text-xs text-white/40">{item.name}</p>
              </div>
            ))}
          </div>
        </ChartPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanel
          eyebrow="Usage Heat"
          title="Copies By AI Tool"
          subtitle="Which tools drive the most prompt usage"
        >
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={copiesByTool} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="rgba(255,255,255,0.45)"
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="copies" radius={[0, 12, 12, 0]}>
                {copiesByTool.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[lavender, blue, pink, cyan, emerald, yellow][index % 6]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          eyebrow="Revenue Signal"
          title="Premium Revenue"
          subtitle={`Total collected: $${totalRevenue.toLocaleString()}`}
        >
          <ResponsiveContainer width="100%" height={330}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={pink} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={pink} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip prefix="$" />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke={pink}
                strokeWidth={3}
                fill="url(#revenueFill)"
                dot={{ r: 4, fill: pink, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <ChartPanel
          eyebrow="Marketplace Shape"
          title="Categories"
          subtitle="Prompt distribution by category"
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={115}
                paddingAngle={4}
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[lavender, blue, pink, cyan, emerald, yellow, red][index % 7]}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          eyebrow="Top Drops"
          title="Most Copied Prompts"
          subtitle="Prompts getting the most user action"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topPrompts}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.35)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="copies" radius={[14, 14, 0, 0]}>
                {topPrompts.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[lavender, pink, blue, cyan, emerald, yellow][index % 6]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl shadow-black/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#967bb6]/30 bg-[#967bb6]/15 text-[#dfcff4]">
            <Crown size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Premium Intelligence</h2>
            <p className="text-sm text-white/45">
              Subscription activity and creator economy signals.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MiniMetric icon={Crown} label="Premium Users" value={premiumUsers} />
          <MiniMetric icon={Sparkles} label="Featured Prompts" value={prompts.filter((p) => p.featured).length} />
          <MiniMetric icon={Copy} label="Average Copies" value={getAverageCopies(prompts)} />
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ eyebrow, title, subtitle, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#967bb6]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/40">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121322] p-5">
      <Icon className="text-[#967bb6]" size={22} />
      <p className="mt-4 text-sm text-white/40">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121322]/95 p-3 shadow-xl backdrop-blur">
      {label && <p className="mb-2 text-xs font-bold text-white/45">{label}</p>}

      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="capitalize text-white/60">{item.name}</span>
          <span className="font-black text-white">
            {prefix}
            {Number(item.value || 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function buildGrowthData(prompts) {
  const grouped = {};

  prompts.forEach((prompt) => {
    const date = prompt.createdAt
      ? new Date(prompt.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Unknown";

    if (!grouped[date]) {
      grouped[date] = { date, prompts: 0, approved: 0 };
    }

    grouped[date].prompts += 1;

    if (prompt.status === "approved") {
      grouped[date].approved += 1;
    }
  });

  return Object.values(grouped).slice(-10);
}

function buildRevenueData(payments) {
  const grouped = {};

  payments.forEach((payment) => {
    const date = payment.createdAt
      ? new Date(payment.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Unknown";

    if (!grouped[date]) {
      grouped[date] = { date, revenue: 0 };
    }

    grouped[date].revenue += Number(payment.amount || 0);
  });

  return Object.values(grouped).slice(-10);
}

function countByStatus(prompts, status) {
  return prompts.filter((prompt) => (prompt.status || "pending") === status)
    .length;
}

function getTotalCopies(prompts) {
  return prompts.reduce((sum, prompt) => sum + Number(prompt.copyCount || 0), 0);
}

function getAverageCopies(prompts) {
  if (!prompts.length) return "0.0";

  return (
    prompts.reduce((sum, prompt) => sum + Number(prompt.copyCount || 0), 0) /
    prompts.length
  ).toFixed(1);
}

function truncate(text, max) {
  if (!text) return "Untitled";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}