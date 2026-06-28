import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSubscription } from "@/lib/actions/subscriptions";

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = params?.session_id;
  const redirectTo = params?.redirect || "/prompts";

  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession?.user) {
    redirect("/auth/signin");
  }

  if (!sessionId) {
    redirect("/payment");
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.payment_status !== "paid") {
    redirect("/payment");
  }

  await createSubscription({
    email: userSession.user.email,
    name: userSession.user.name,
    isPremium: true,
    subscription: "premium",
    paymentIntentId: checkoutSession.payment_intent,
    stripeSessionId: checkoutSession.id,
    amount: checkoutSession.amount_total / 100,
    currency: checkoutSession.currency,
    date: new Date().toISOString(),
  }, await headers());

  redirect(redirectTo);
}