"use client";

import { motion } from "framer-motion";
import { Person, Copy, Star, Thunderbolt, Flame, CircleCheck } from "@gravity-ui/icons";
import { Icon } from "@gravity-ui/uikit";

const stats = [
  { label: "Engineered Prompts", value: "85K+", icon: Thunderbolt },
  { label: "Elite Creators", value: "4.2K", icon: Person },
  { label: "Prompt Generations", value: "3.8M", icon: Copy },
  { label: "Success Rating", value: "99%", icon: Star },
];

export default function StatsSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 py-24">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#967bb6]/10 blur-[130px]" />

      <div className="relative z-10 mb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#967bb6]/30 bg-[#967bb6]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#dfcff4]">
          <Icon data={Flame} size={13} />
          Live Ecosystem Metrics
        </div>

        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
          Promptrix Is Powering The{" "}
          <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
            Prompt Economy
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/45">
          Real platform signals across creators, copies, premium unlocks, and marketplace activity.
        </p>
      </div>

      <div className="relative z-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="group relative h-60 overflow-hidden rounded-3xl border border-white/10 bg-[#121322]/80 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#967bb6] via-[#8a96ce] to-[#d946ef] opacity-70" />
            <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-[#967bb6]/15 blur-2xl transition group-hover:scale-125" />

            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#967bb6]/30 bg-[#967bb6]/15 text-[#dfcff4]">
                <Icon data={stat.icon} size={24} />
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/35">
                <Icon data={CircleCheck} size={11} />
                0{index + 1}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-5xl font-black tracking-tight text-white">
                {stat.value}
              </h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/40">
                {stat.label}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}