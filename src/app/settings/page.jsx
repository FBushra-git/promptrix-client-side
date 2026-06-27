"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Bell, Moon, Shield, UserCog } from "lucide-react";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [premiumAlerts, setPremiumAlerts] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  if (isPending) return <p className="p-8 text-white">Loading settings...</p>;

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <main className="min-h-screen p-8 text-white">
      <section className="max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#967bb6]">
            Preferences
          </p>

          <h1 className="text-5xl font-black italic">
            Account{" "}
            <span className="bg-gradient-to-r from-[#967bb6] to-[#8a96ce] bg-clip-text text-transparent">
              Settings
            </span>
          </h1>

          <p className="mt-3 text-white/50">
            Manage your Promptrix creator experience.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <SettingToggle
            icon={Bell}
            title="Email Notifications"
            description="Receive updates about reviews, bookmarks, and prompt activity."
            checked={emailNotifications}
            onChange={() => setEmailNotifications((prev) => !prev)}
          />

          <SettingToggle
            icon={Shield}
            title="Premium Alerts"
            description="Show premium lock and subscription notices across private prompts."
            checked={premiumAlerts}
            onChange={() => setPremiumAlerts((prev) => !prev)}
          />

          <SettingToggle
            icon={Moon}
            title="Compact Dashboard Mode"
            description="Use a denser layout for tables and prompt management."
            checked={compactMode}
            onChange={() => setCompactMode((prev) => !prev)}
          />

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#967bb6]/15 text-[#d8c6ef]">
                <UserCog size={20} />
              </div>
              <div>
                <h2 className="font-black">Account Identity</h2>
                <p className="text-sm text-white/45">
                  Signed in as {user?.email}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ReadOnlyField label="Name" value={user?.name || "N/A"} />
              <ReadOnlyField label="Email" value={user?.email || "N/A"} />
              <ReadOnlyField
                label="Subscription"
                value={
                  user?.isPremium || user?.subscription === "premium"
                    ? "Premium"
                    : "Free"
                }
              />
              <ReadOnlyField label="Role" value={user?.role || "user"} />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] px-8 py-4 font-black text-white shadow-xl shadow-[#967bb6]/20 transition hover:scale-[1.02]"
          >
            Save Settings
          </button>
        </div>
      </section>
    </main>
  );
}

function SettingToggle({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#967bb6]/15 text-[#d8c6ef]">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-black">{title}</h2>
          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>
      </div>

      <button
        onClick={onChange}
        className={`relative h-8 w-14 rounded-full transition ${
          checked ? "bg-[#967bb6]" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121322] p-4">
      <p className="text-xs uppercase tracking-widest text-white/35">{label}</p>
      <p className="mt-2 break-all font-bold">{value}</p>
    </div>
  );
}