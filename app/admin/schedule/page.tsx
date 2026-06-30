import type { Metadata } from "next";
import { getAllUpcomingBookings } from "@/lib/bookings";
import type { ServiceType } from "@/lib/session-types";
import { SERVICE_LABELS } from "@/lib/session-types";
import { seedSessionsIfEmpty } from "@/lib/sessions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Schedule — Happy Hounds Admin" };

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

export default function AdminSchedulePage() {
  seedSessionsIfEmpty();
  const bookings = getAllUpcomingBookings();

  // Group by date
  const byDate = bookings.reduce<
    Record<string, typeof bookings>
  >((acc, b) => {
    if (!acc[b.session_date]) acc[b.session_date] = [];
    acc[b.session_date].push(b);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Upcoming bookings</h1>
            <p className="mt-1 text-sm text-stone-500">
              {bookings.length} confirmed booking{bookings.length !== 1 ? "s" : ""} from today
            </p>
          </div>
          <a
            href="mailto:hello@happyhoundscentre.co.uk"
            className="hidden text-sm text-amber-700 hover:underline sm:block"
          >
            Email customers
          </a>
        </div>

        {bookings.length === 0 && (
          <div className="mt-10 rounded-xl border border-stone-200 bg-stone-50 px-6 py-12 text-center text-stone-500">
            No upcoming bookings yet.
          </div>
        )}

        <div className="mt-8 space-y-8">
          {dates.map((date) => {
            const dayBookings = byDate[date];
            // Group by session time within the day
            const bySession = dayBookings.reduce<Record<string, typeof dayBookings>>((acc, b) => {
              const key = `${b.service_type}|${b.session_start}`;
              if (!acc[key]) acc[key] = [];
              acc[key].push(b);
              return acc;
            }, {});

            return (
              <section key={date}>
                <h2 className="text-base font-bold text-stone-800 border-b border-stone-200 pb-2">
                  {formatDate(date)}
                </h2>

                <div className="mt-3 space-y-4">
                  {Object.entries(bySession).map(([key, slot]) => {
                    const [serviceType, startTime] = key.split("|");
                    const endTime = slot[0].session_end;
                    return (
                      <div key={key} className="rounded-xl border border-stone-200 bg-white overflow-hidden">
                        <div className="flex items-center justify-between bg-stone-50 px-4 py-3 border-b border-stone-100">
                          <div>
                            <p className="text-sm font-semibold text-stone-900">
                              {SERVICE_LABELS[serviceType as ServiceType] ?? serviceType}
                            </p>
                            <p className="text-xs text-stone-500">
                              {formatTime(startTime)} – {formatTime(endTime)}
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            {slot.length} booked
                          </span>
                        </div>

                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-stone-100 text-left">
                              <th className="px-4 py-2 text-xs font-semibold text-stone-500">Dog</th>
                              <th className="px-4 py-2 text-xs font-semibold text-stone-500">Owner</th>
                              <th className="hidden px-4 py-2 text-xs font-semibold text-stone-500 sm:table-cell">Email</th>
                              <th className="px-4 py-2 text-xs font-semibold text-stone-500">Ref</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slot.map((b) => (
                              <tr key={b.id} className="border-b border-stone-50 last:border-0">
                                <td className="px-4 py-2.5">
                                  <span className="font-medium text-stone-900">{b.dog_name}</span>
                                  <br />
                                  <span className="text-xs text-stone-400">{b.dog_breed}</span>
                                </td>
                                <td className="px-4 py-2.5 text-stone-700">{b.customer_name}</td>
                                <td className="hidden px-4 py-2.5 sm:table-cell">
                                  <a
                                    href={`mailto:${b.customer_email}`}
                                    className="text-amber-700 hover:underline"
                                  >
                                    {b.customer_email}
                                  </a>
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs text-stone-500">
                                  {b.confirmation_code}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-stone-400">
          Showing confirmed bookings only. To cancel a booking, email the customer directly.
        </p>
      </div>
    </div>
  );
}
