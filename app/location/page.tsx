import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location & Hours",
  description:
    "Find Happy Hounds Activity Centre in Wrexham, LL12. Address, opening hours and directions.",
};

const hours = [
  { day: "Monday", time: "7:30 am – 6:30 pm" },
  { day: "Tuesday", time: "7:30 am – 6:30 pm" },
  { day: "Wednesday", time: "7:30 am – 6:30 pm" },
  { day: "Thursday", time: "7:30 am – 6:30 pm" },
  { day: "Friday", time: "7:30 am – 6:30 pm" },
  { day: "Saturday", time: "8:00 am – 5:00 pm" },
  { day: "Sunday", time: "Closed" },
];

export default function LocationPage() {
  return (
    <div className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Location &amp; Hours
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
          We&apos;re based in the LL12 area of Wrexham with easy road access and
          on-site parking.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Address */}
          <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Address</h2>
            <address className="mt-4 not-italic text-stone-700 leading-relaxed">
              <p className="font-medium">Happy Hounds Activity Centre</p>
              <p className="mt-1 text-stone-500 text-sm italic">
                Full address coming soon — please get in touch for directions while we&apos;re setting up.
              </p>
              <p className="mt-3">Wrexham</p>
              <p>LL12</p>
              <p>Wales</p>
            </address>
            <p className="mt-6 text-sm text-stone-600">
              <span className="font-medium">Parking:</span> Free on-site parking available.
            </p>
            <p className="mt-2 text-sm text-stone-600">
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:hello@happyhoundscentre.co.uk"
                className="text-amber-700 hover:underline"
              >
                hello@happyhoundscentre.co.uk
              </a>
            </p>
          </section>

          {/* Hours */}
          <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Opening Hours</h2>
            <p className="mt-1 text-sm text-stone-500">
              Drop-off from opening; pick-up by close.
            </p>
            <dl className="mt-4">
              {hours.map(({ day, time }) => (
                <div
                  key={day}
                  className="flex items-center justify-between border-b border-stone-100 py-2.5 last:border-0"
                >
                  <dt className="text-sm font-medium text-stone-700">{day}</dt>
                  <dd
                    className={`text-sm ${
                      time === "Closed" ? "text-stone-400" : "text-stone-900"
                    }`}
                  >
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-stone-400">
              Hours may vary on bank holidays — check back or get in touch.
            </p>
          </section>
        </div>

        {/* Getting here */}
        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
          <h2 className="text-xl font-bold text-stone-900">Getting here</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm text-stone-600">
            <div>
              <p className="font-semibold text-stone-900">By car</p>
              <p className="mt-1 leading-relaxed">
                Easily accessible from the A483, A55 and Wrexham town centre.
                Full driving directions will be available once we open.
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-900">By bus</p>
              <p className="mt-1 leading-relaxed">
                Bus routes serving the LL12 area stop nearby. Contact us and
                we&apos;ll help you plan the best route.
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-900">On foot or by bike</p>
              <p className="mt-1 leading-relaxed">
                Cycle parking available on site. Good pavement links to the
                surrounding area.
              </p>
            </div>
          </div>
        </section>

        {/* Map placeholder — real embed needs actual address */}
        <p className="mt-8 text-center text-sm text-stone-400">
          Interactive map coming soon once our full address is confirmed.
        </p>
      </div>
    </div>
  );
}
