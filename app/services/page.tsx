import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Daycare, play sessions, enrichment and positive training for dogs at Happy Hounds Activity Centre, Wrexham.",
};

const services = [
  {
    id: "daycare",
    name: "Dog Daycare",
    tagline: "A full day of supervised play while you&rsquo;re at work.",
    description: [
      "Our full-day daycare runs in small, temperament-matched groups in our enclosed indoor space. Dogs arrive in the morning, spend the day playing, resting and socialising, and go home happy and tired.",
      "We do an initial assessment with every new dog before their first daycare day to make sure the environment is the right fit for them.",
    ],
    details: [
      "Supervised play in matched groups",
      "Midday rest period",
      "Enrichment activities included",
      "Real-time updates on request",
      "Safe drop-off and pick-up",
    ],
  },
  {
    id: "play",
    name: "Play Sessions",
    tagline: "Shorter structured sessions — great as a taster or standalone.",
    description: [
      "Half-day play sessions for dogs that don't need a full day away from home, or for owners who want to try the centre before committing to full daycare.",
      "Morning and afternoon slots available most days.",
    ],
    details: [
      "Morning or afternoon slots",
      "Supervised group or individual play",
      "Suits dogs new to daycare",
      "Can be booked as a one-off",
    ],
  },
  {
    id: "enrichment",
    name: "Enrichment Activities",
    tagline: "Tired mind, happy dog.",
    description: [
      "Mental stimulation is just as important as physical exercise. Our enrichment sessions use scent work, puzzle feeders, sensory activities and novel environments to give dogs a different kind of workout.",
      "Enrichment can be added on to daycare or booked as a standalone session.",
    ],
    details: [
      "Scent work and nose games",
      "Puzzle and licki-mat activities",
      "Sensory exploration",
      "Available as add-on or standalone",
    ],
  },
  {
    id: "training",
    name: "Positive Reinforcement Training",
    tagline: "Reward-based coaching in a calm, distraction-managed space.",
    description: [
      "Training sessions at the centre give you a controlled, distraction-managed indoor environment — much easier to work in than a busy park. All coaching uses positive reinforcement only; no aversive tools or techniques.",
      "Sessions can focus on general manners, recall, lead work, or specific issues. Get in touch to discuss what your dog needs.",
    ],
    details: [
      "One-to-one sessions",
      "Positive reinforcement only",
      "Suitable for puppies and adults",
      "Focus areas tailored to your dog",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          What we offer
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
          Everything we do happens indoors, in a supervised, positive environment designed for dogs
          to feel safe and thrive.
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {services.map(({ id, name, tagline, description, details }) => (
            <article
              key={id}
              id={id}
              className="scroll-mt-24 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100"
            >
              <h2 className="text-2xl font-bold text-stone-900">{name}</h2>
              <p
                className="mt-1 text-base font-medium text-amber-700"
                dangerouslySetInnerHTML={{ __html: tagline }}
              />
              <div className="mt-4 flex flex-col gap-3">
                {description.map((para, i) => (
                  <p key={i} className="leading-relaxed text-stone-600">
                    {para}
                  </p>
                ))}
              </div>
              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
                {details.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="mt-0.5 text-amber-600" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-amber-600 px-8 py-8 text-center text-white">
          <p className="text-xl font-bold">Ready to get started?</p>
          <p className="mt-2 text-amber-100">
            All new dogs need a brief assessment before their first session.
          </p>
          <Link
            href="/booking"
            className="mt-5 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
          >
            Book or enquire
          </Link>
        </div>
      </div>
    </div>
  );
}
