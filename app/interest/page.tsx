import type { Metadata } from "next";
import InterestForm from "./InterestForm";

export const metadata: Metadata = {
  title: "Register Your Interest",
  description:
    "We're planning an indoor dog play and training space near Llay, Wrexham. Tell us what you'd use, how often, and what you'd pay — takes 1 minute.",
  openGraph: {
    title: "Would you use an indoor dog activity space in Wrexham?",
    description:
      "Happy Hounds Activity Centre is planning an indoor space for dog play, daycare, training and private hire near Llay, Wrexham. Register your interest and help us decide what to build.",
    type: "website",
  },
};

const services = [
  "Private hire",
  "Puppy confidence sessions",
  "Reactive dog-friendly slots",
  "Structured social play",
  "Training classes",
  "Daycare",
  "Wet-weather exercise",
];

export default function InterestPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-amber-600 px-6 py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-200">
            Llay &amp; Wrexham
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Would you use an indoor dog activity space near you?
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-amber-100">
            We&apos;re planning to open Happy Hounds Activity Centre — an indoor space for dogs
            to play, train and socialise whatever the Welsh weather brings. Before we commit,
            we want to hear from the people who&apos;d actually use it.
          </p>
          <p className="mt-3 text-amber-100">
            No hard sell. Nine quick questions. Your answers directly shape what we build.
          </p>

          {/* Services preview */}
          <ul className="mt-7 flex flex-wrap gap-2" role="list" aria-label="Planned activities">
            {services.map((s) => (
              <li
                key={s}
                className="rounded-full border border-amber-400 px-3 py-1 text-xs font-medium text-amber-100"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-bold text-stone-900">
            Tell us what you think
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Takes about 1 minute. If we open, people who register first get priority access.
          </p>
          <div className="mt-6">
            <InterestForm />
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="border-t border-stone-200 px-6 py-10">
        <div className="mx-auto max-w-2xl text-sm text-stone-500">
          <p>
            <strong className="text-stone-700">Happy Hounds Activity Centre</strong> is a
            planned indoor dog activity centre serving Llay, Wrexham and the surrounding
            LL12 area. Questions?{" "}
            <a
              href="mailto:hello@happyhoundscentre.co.uk"
              className="text-amber-700 hover:underline"
            >
              hello@happyhoundscentre.co.uk
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
