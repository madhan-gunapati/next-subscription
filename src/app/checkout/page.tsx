"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error || !paymentMethod) {
      console.error("Payment error", error);
      return;
    }

    const res = await fetch("/api/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        paymentMethodId: paymentMethod.id,
        priceId: "price_1RH7I24JgYJcsKhbqJ8yOEWg", // Replace with your Stripe Price ID
      }),
    });

    const data = await res.json();
    console.log("Subscription:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your Email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* <CardElement  /> */}
      <CardElement
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": { color: "#a0aec0" },
        fontFamily: "Arial, sans-serif",
        padding: "10px"
      },
      invalid: { color: "#e53e3e" },
    },
    hidePostalCode: true,
  }}
/>
      <button type="submit" disabled={!stripe}>Subscribe</button>
    </form>
  );
};

const Page: React.FC = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Page;
