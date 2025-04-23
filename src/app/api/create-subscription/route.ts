// app/api/create-subscription/route.ts
import { NextRequest } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { email, paymentMethodId, priceId } = await req.json();

  try {
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
