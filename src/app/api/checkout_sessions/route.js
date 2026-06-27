import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const user = await getUserSession(headers());

    if (!user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const redirectTo = formData.get("redirectTo") || "/prompts";

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Promptrix Premium Access",
              description:
                "One-time premium unlock for all private prompts and premium interactions.",
              metadata: {
                plan: "premium",
              },
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        email: user.email,
        plan: "premium",
        amount: "5",
        redirectTo: redirectTo.toString(),
      },

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&redirect=${encodeURIComponent(
        redirectTo.toString()
      )}`,

      cancel_url: `${origin}/payment?redirect=${encodeURIComponent(
        redirectTo.toString()
      )}`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}