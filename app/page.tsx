import Link from "next/link";

const services = [
  {
    name: "Dog Daycare",
    description:
      "Full-day supervised play in our safe indoor space. Your dog socialises, exercises and rests — you get on with your day.",
    href: "/services#daycare",
  },
  {
    name: "Play Sessions",
    description:
      "Shorter structured sessions for dogs that need less time away from home, or as a taster before starting daycare.",
    href: "/services#play",
  },
  {
    name: "Enrichment",
    description:
      "Sensory activities, puzzle games and scent work designed to tire the mind as well as the body.",
    href: "/services#enrichment",
  },
  {
    name: "Training",
    description:
      "Positive reinforcement coaching in a calm, distraction-managed indoor environment.",
    href: "/services#training",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-amber-600 px-6 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            A safe place for your dog to play, learn and thrive
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-amber-100">
            Happy Hounds Activity Centre is an indoor dog activity centre in
            Wrexham (LL12). Structured daycare, play sessions, enrichment and
            positive training — in a calm, professionally supervised space.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
            >
              Book a session
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-amber-200 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
            >
              See what we offer
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Why Happy Hounds?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Safe, indoor space",
                body: "Fully enclosed and weatherproof — dogs play whatever the Welsh weather brings.",
              },
              {
                title: "Small groups",
                body: "Sessions are kept small so every dog gets the attention and supervision they need.",
              },
              {
                title: "Positive only",
                body: "We use reward-based methods throughout — no punishment, no stress.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
                <p className="font-semibold text-stone-900">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="border-t border-stone-200 bg-white px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">What we offer</h2>
            <Link href="/services" className="text-sm font-medium text-amber-700 hover:underline">
              Full services →
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
            {services.map(({ name, description, href }) => (
              <li key={name} className="rounded-xl border border-stone-200 p-5">
                <p className="font-semibold text-stone-900">{name}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{description}</p>
                <Link
                  href={href}
                  className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
                >
                  Learn more →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Location teaser */}
      <section className="border-t border-stone-200 px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Find us in Wrexham</h2>
          <p className="mt-3 max-w-xl text-stone-600">
            We&apos;re based in the LL12 area of Wrexham with easy road access and on-site parking.
            Open Monday to Saturday — see full address and hours on our location page.
          </p>
          <Link
            href="/location"
            className="mt-5 inline-block text-sm font-medium text-amber-700 hover:underline"
          >
            Location &amp; hours →
          </Link>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-stone-200 bg-stone-900 px-6 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to book?</h2>
          <p className="mt-3 text-stone-300">
            Sessions fill up quickly. Reserve your dog&apos;s spot online.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block rounded-lg bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            Book a session
          </Link>
        </div>
      </section>
    </>
  );
}
