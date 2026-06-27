"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Crown, Search, Sparkles, ArrowUpRight } from "lucide-react";

const benefits = [
  {
    title: "Admin-Gated Quality",
    text: "Every submitted prompt stays hidden until an admin approves it for the marketplace.",
    icon: ShieldCheck,
  },
  {
    title: "Premium Prompt Vault",
    text: "Private prompt content stays locked until the user activates Premium access.",
    icon: Crown,
  },
  {
    title: "Precision Discovery",
    text: "Backend search, filters, sorting, and pagination keep browsing fast and focused.",
    icon: Search,
  },
  {
    title: "Creator Command Center",
    text: "Creators can manage prompts, track copies, view analytics, and grow their catalog.",
    icon: Sparkles,
  },
];

export default function WhyChooseUs() {
  return (
  <section className="relative mx-auto max-w-7xl overflow-visible px-4 py-28">
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-4 py-10 shadow-2xl shadow-black/20 sm:px-6 lg:px-8 lg:py-14">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#967bb6]/10 blur-[100px]" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-[#8a96ce]/10 blur-[100px]" />

      <div className="relative z-10 mb-12 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#967bb6]">
            Why Promptrix
          </p>

          <h2 className="mt-5 max-w-3xl pb-2 text-4xl font-black uppercase italic leading-[1.08] tracking-tight text-white md:text-6xl">
            Built Like A{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Prompt Operating System
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm leading-7 text-white/50">
          Designed for creators, users, and admins who need a marketplace that
          feels fast, moderated, and premium from the first click.
        </p>
      </div>

      <div className="relative z-10 grid gap-5 md:grid-cols-2">
        {benefits.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="group relative min-h-[180px] overflow-hidden rounded-3xl border border-white/10 bg-[#121322]/80 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent opacity-70" />
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#967bb6]/10" />

            <div className="flex items-start justify-between gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#967bb6]/30 bg-[#967bb6]/15 text-[#dfcff4]">
                <item.icon size={23} />
              </div>

              <ArrowUpRight className="text-white/25 transition group-hover:text-[#967bb6]" />
            </div>

            <h3 className="mt-7 text-2xl font-black text-white">
              {item.title}
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              {item.text}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
}