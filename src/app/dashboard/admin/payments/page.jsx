import { requireAdmin } from "@/lib/core/requireAdmin";
import { getAllPaymentsForAdmin } from "@/lib/api/admin";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const payments = await getAllPaymentsForAdmin();

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#967bb6]">Revenue Ledger</p>
          <h1 className="mt-3 text-4xl font-black italic">All Payments</h1>
          <p className="mt-2 text-white/45">Stripe premium purchases and transaction records.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#121322] text-xs uppercase tracking-widest text-white/40">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Intent</th>
                  <th className="p-4">Stripe Session</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {(Array.isArray(payments) ? payments : []).map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/[0.04]">
                    <td className="p-4">
                      <p className="font-bold">{payment.name || "Unknown"}</p>
                      <p className="text-sm text-white/40">{payment.email}</p>
                    </td>
                    <td className="p-4 font-black text-[#dfcff4]">
                      ${payment.amount || 5} {payment.currency || "usd"}
                    </td>
                    <td className="p-4 max-w-[220px] truncate text-sm text-white/50">{payment.paymentIntentId}</td>
                    <td className="p-4 max-w-[220px] truncate text-sm text-white/50">{payment.stripeSessionId}</td>
                    <td className="p-4 text-sm text-white/50">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}