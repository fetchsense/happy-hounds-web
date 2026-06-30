import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book a daycare, play, enrichment or training session at Happy Hounds Activity Centre, Wrexham.",
};

export default function BookingPage() {
  return (
    <div className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Book a session
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Online booking is coming soon. In the meantime, please get in touch by email and
          we&apos;ll get your dog booked in.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
          <h2 className="text-xl font-bold text-stone-900">Get in touch</h2>
          <p className="mt-2 text-stone-600">
            Email us with your dog&apos;s name, breed and the type of session you&apos;re
            interested in. We&apos;ll reply within one working day.
          </p>
          <a
            href="mailto:hello@happyhoundscentre.co.uk?subject=Booking%20enquiry"
            className="mt-6 inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Email us to book
          </a>
        </div>

        <section className="mt-8 rounded-xl border border-stone-200 bg-stone-50 px-6 py-5">
          <h2 className="font-semibold text-stone-900">What to include in your email</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-600" role="list">
            <li className="flex gap-2">
              <span className="text-amber-600" aria-hidden="true">1.</span>
              Your dog&apos;s name, breed, age and whether they&apos;re neutered/spayed
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600" aria-hidden="true">2.</span>
              The type of session you&apos;re interested in (daycare, play session, enrichment, training)
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600" aria-hidden="true">3.</span>
              Your preferred days and rough frequency
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600" aria-hidden="true">4.</span>
              Any relevant health or behaviour information we should know about
            </li>
          </ul>
        </section>

        <p className="mt-8 text-sm text-stone-500">
          Not sure which session is right for your dog?{" "}
          <Link href="/services" className="text-amber-700 hover:underline">
            Read about our services
          </Link>{" "}
          or{" "}
          <Link href="/pricing" className="text-amber-700 hover:underline">
            check our pricing
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
