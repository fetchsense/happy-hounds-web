import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Pricing for dog daycare, play sessions, enrichment and training at Happy Hounds Activity Centre, Wrexham.",
};

const plans = [
  {
    name: "Play Session",
    price: "From £15",
    period: "per half-day",
    description: "A shorter supervised session — ideal for a taster or dogs that don't need a full day.",
    features: [
      "Morning or afternoon slot",
      "Supervised group play",
      "Up to 4 hours",
    ],
    cta: "Book a play session",
  },
  {
    name: "Full Day Daycare",
    price: "From £25",
    period: "per day",
    description: "Drop off in the morning, collect in the evening. Enrichment activities included.",
    features: [
      "Up to 8 hours",
      "Enrichment activities included",
      "Midday rest period",
      "Real-time updates available",
    ],
    highlight: true,
    cta: "Book daycare",
  },
  {
    name: "Training Session",
    price: "From £30",
    period: "per hour",
    description: "One-to-one positive reinforcement coaching in our calm indoor space.",
    features: [
      "One-to-one with trainer",
      "Positive methods only",
      "Tailored to your dog",
    ],
    cta: "Book training",
  },
];

const addOns = [
  { name: "Enrichment add-on", price: "From £8", note: "Added to any daycare or play booking" },
  { name: "Standalone enrichment session", price: "From £15", note: "Without a play session" },
];

export default function PricingPage() {
  return (
    <div className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Pricing</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
          Simple, transparent pricing. All prices shown are guides — get in touch to confirm
          availability and exact rates.
        </p>

        {/* Pricing cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map(({ name, price, period, description, features, highlight, cta }) => (
            <div
              key={name}
              className={`flex flex-col rounded-2xl p-6 ring-1 ${
                highlight
                  ? "bg-amber-600 text-white ring-amber-600"
                  : "bg-white text-stone-900 ring-stone-200"
              }`}
            >
              <p className={`text-sm font-semibold uppercase tracking-wide ${highlight ? "text-amber-200" : "text-stone-500"}`}>
                {name}
              </p>
              <p className={`mt-3 text-3xl font-bold ${highlight ? "text-white" : "text-stone-900"}`}>
                {price}
              </p>
              <p className={`text-sm ${highlight ? "text-amber-200" : "text-stone-500"}`}>
                {period}
              </p>
              <p className={`mt-4 text-sm leading-relaxed ${highlight ? "text-amber-100" : "text-stone-600"}`}>
                {description}
              </p>
              <ul className={`mt-4 flex-1 space-y-2 text-sm ${highlight ? "text-amber-100" : "text-stone-600"}`} role="list">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`mt-0.5 ${highlight ? "text-amber-200" : "text-amber-600"}`} aria-hidden="true">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/booking"
                className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  highlight
                    ? "bg-white text-amber-700 hover:bg-amber-50 focus:ring-white focus:ring-offset-amber-600"
                    : "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-stone-900">Enrichment add-ons</h2>
          <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
            {addOns.map(({ name, price, note }, i) => (
              <div
                key={name}
                className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  i > 0 ? "border-t border-stone-100" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-stone-900">{name}</p>
                  <p className="text-sm text-stone-500">{note}</p>
                </div>
                <p className="text-lg font-semibold text-stone-900">{price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mt-10 rounded-xl border border-stone-200 bg-stone-50 px-6 py-5">
          <h2 className="font-semibold text-stone-900">A few things to know</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-600" role="list">
            <li>All new dogs require a short assessment before their first session — this is free and can usually be arranged the same week as your first booking.</li>
            <li>Prices are subject to change; the booking confirmation you receive will always show the final price.</li>
            <li>Cancellation policy: please give us at least 24 hours&apos; notice to avoid a session fee.</li>
            <li>Block bookings and regular weekly slots may attract a small discount — ask when you book.</li>
          </ul>
        </section>

        <p className="mt-8 text-sm text-stone-500">
          Questions about pricing?{" "}
          <a href="mailto:hello@happyhoundscentre.co.uk" className="text-amber-700 hover:underline">
            Get in touch
          </a>{" "}
          and we&apos;ll be happy to help.
        </p>
      </div>
    </div>
  );
}
