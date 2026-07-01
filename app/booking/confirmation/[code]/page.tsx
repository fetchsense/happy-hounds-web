import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingByCode } from "@/lib/bookings";
import type { ServiceType } from "@/lib/session-types";
import { SERVICE_LABELS, SERVICE_PRICES_PENCE } from "@/lib/session-types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return { title: `Booking confirmed — ${code}` };
}

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

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

export default async function ConfirmationPage({ params }: Props) {
  const { code } = await params;
  const booking = getBookingByCode(code.toUpperCase());

  if (!booking) notFound();

  const price = formatPrice(SERVICE_PRICES_PENCE[booking.service_type as ServiceType] ?? 0);

  return (
    <div className="px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        {/* Success banner */}
        <div className="rounded-2xl bg-amber-600 px-8 py-10 text-center text-white">
          <div className="text-4xl" aria-hidden="true">🐾</div>
          <p className="mt-3 text-2xl font-bold">Booking confirmed!</p>
          <p className="mt-2 text-amber-100">
            We&apos;ll see{" "}
            <strong className="text-white">{booking.dog_name}</strong> on{" "}
            {formatDate(booking.session_date)}.
          </p>
        </div>

        {/* Confirmation code */}
        <div className="mt-6 rounded-xl border border-stone-200 bg-white px-6 py-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Your confirmation code
          </p>
          <p className="mt-1 text-3xl font-bold tracking-widest text-amber-700">
            {booking.confirmation_code}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Keep this safe — you&apos;ll need it on the day
          </p>
        </div>

        {/* Booking details */}
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <dl>
            <div className="flex justify-between gap-4 border-b border-stone-100 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Service</dt>
              <dd className="text-sm font-semibold text-stone-900">
                {SERVICE_LABELS[booking.service_type as ServiceType] ?? booking.service_type}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Date</dt>
              <dd className="text-sm text-stone-900">{formatDate(booking.session_date)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Time</dt>
              <dd className="text-sm text-stone-900">
                {formatTime(booking.session_start)} – {formatTime(booking.session_end)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Dog</dt>
              <dd className="text-sm text-stone-900">
                {booking.dog_name} ({booking.dog_breed})
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Name</dt>
              <dd className="text-sm text-stone-900">{booking.customer_name}</dd>
            </div>
            <div className="flex justify-between gap-4 px-5 py-3">
              <dt className="text-sm font-medium text-stone-500">Price</dt>
              <dd className="text-sm font-semibold text-stone-900">
                {price}{" "}
                {booking.stripe_session_id ? (
                  <span className="text-green-700">— paid online</span>
                ) : (
                  <span className="text-amber-700">— pay on the day</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* What to bring / notes */}
        <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-5">
          <p className="font-semibold text-stone-900">What to bring on the day</p>
          <ul className="mt-3 space-y-1.5 text-sm text-stone-600" role="list">
            <li>Your confirmation code: <strong>{booking.confirmation_code}</strong></li>
            {!booking.stripe_session_id && <li>Payment of {price} (card or cash)</li>}
            <li>Any food/treats your dog needs during the day</li>
            <li>Up-to-date vaccination records if it&apos;s your dog&apos;s first visit</li>
          </ul>
        </div>

        {/* Cancellation */}
        <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4">
          <p className="text-sm font-semibold text-stone-700">Need to cancel or change?</p>
          <p className="mt-1 text-sm text-stone-500">
            Please give us at least 24 hours&apos; notice by emailing{" "}
            <a
              href={`mailto:hello@happyhoundscentre.co.uk?subject=Cancellation%20${booking.confirmation_code}`}
              className="text-amber-700 hover:underline"
            >
              hello@happyhoundscentre.co.uk
            </a>{" "}
            with your confirmation code.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link href="/booking" className="text-amber-700 hover:underline">
            Book another session
          </Link>
          <span className="text-stone-300" aria-hidden="true">|</span>
          <Link href="/" className="text-stone-600 hover:text-stone-900">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
