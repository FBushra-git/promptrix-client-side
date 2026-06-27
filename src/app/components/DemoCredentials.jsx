import Link from "next/link";
import {
  ShieldCheck,
  PenTool,
  UserRound,
  KeyRound,
  Mail,
  ArrowRight,
} from "lucide-react";

const demoAccounts = [
  {
    role: "Admin",
    email: "adminnew@gmail.com",
    password: "AdN123456",
    icon: ShieldCheck,
    accent: "from-red-400 to-[#967bb6]",
    button: "bg-gradient-to-r from-[#7c3aed] to-[#9333ea]",
    note: "Review prompts, manage users, payments, reports, and analytics.",
  },
  {
    role: "creator",
    email: "creator@gmail.com",
    password: "Cr123456",
    icon: PenTool,
    accent: "from-[#967bb6] to-[#8a96ce]",
    button: "bg-[#1f2435] hover:bg-[#252b3f]",
    note: "Add prompts, manage prompt status, and view creator analytics.",
  },
  {
    role: "user",
    email: "user1@gmail.com",
    password: "Ts123456",
    icon: UserRound,
    accent: "from-[#22d3ee] to-[#967bb6]",
    button: "bg-[#1f2435] hover:bg-[#252b3f]",
    note: "Browse prompts, save favorites, review, and test premium access.",
  },
];

export default function DemoCredentials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#967bb6] to-transparent" />

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">
              Instructor Preview
            </p>

            <h2 className="mt-3 text-4xl font-black italic text-white">
              Demo Login{" "}
              <span className="text-[#967bb6]">Accounts</span>
            </h2>

            <p className="mt-3 max-w-2xl text-white/50">
              Use these cards to jump into the login page with credentials
              already filled.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {demoAccounts.map((account) => {
            const href = `/auth/signin?email=${encodeURIComponent(
              account.email
            )}&password=${encodeURIComponent(account.password)}`;

            return (
              <article
                key={account.role}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121322]/80 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#967bb6]/60"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${account.accent}`}
                />

                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${account.accent} text-white shadow-lg shadow-[#967bb6]/20`}
                  >
                    <account.icon size={22} />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-widest text-white/60">
                    {account.role}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">
                  {account.role} Access
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/45">
                  {account.note}
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1120]/70 p-4">
                  <CredentialRow
                    icon={Mail}
                    label="Email"
                    value={account.email}
                  />

                  <div className="my-4 h-px bg-white/10" />

                  <CredentialRow
                    icon={KeyRound}
                    label="Password"
                    value={account.password}
                  />
                </div>

                <Link
                  href={href}
                  className={`mt-5 btn-gradient flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] ${account.button}`}
                >
                  Go to Login
                  <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CredentialRow({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={15} className="text-white/45" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          {label}
        </p>
      </div>

      <div className="rounded-xl bg-[#080b14] px-4 py-3">
        <p className="break-all font-mono text-sm font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}