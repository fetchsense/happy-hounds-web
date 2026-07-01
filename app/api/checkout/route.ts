import type { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createPendingBooking, getBookingById } from "@/lib/bookings";
import { getSessionById } from "@/lib/sessions";
import {
  SERVICE_LABELS,
  SERVICE_PRICES_PENCE,
  type ServiceType,
} from "@/lib/session-types";

export const runtime = "nodejs";

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${suffix}`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { session_id, customer_name, customer_email, dog_name, dog_breed, notes, idempotency_key } = body;

  if (!session_id || !customer_name || !customer_email || !dog_name || !dog_breed) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (typeof customer_email !== "string" || !customer_email.includes("@")) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const sessionData = getSessionById(Number(session_id));
  if (!sessionData) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  // Create (or retrieve idempotent) pending booking
  const result = createPendingBooking({
    session_id: Number(session_id),
    customer_name: String(customer_name).trim(),
    customer_email: String(customer_email).trim().toLowerCase(),
    dog_name: String(dog_name).trim(),
    dog_breed: String(dog_breed).trim(),
    notes: notes ? String(notes).trim() : undefined,
    idempotency_key: idempotency_key ? String(idempotency_key) : undefined,
  });

  if (!result.ok) {
    const status = result.error === "SESSION_NOT_FOUND" ? 404 : 409;
    return Response.json({ error: result.error }, { status });
  }

  const booking = result.booking;

  // If already confirmed (idempotent repeat for a completed booking), redirect straight to confirmation
  if (booking.status === "confirmed") {
    const origin = new URL(request.url).origin;
    return Response.json({ url: `${origin}/booking/confirmation/${booking.confirmation_code}` });
  }

  const serviceType = sessionData.service_type as ServiceType;
  const price = SERVICE_PRICES_PENCE[serviceType] ?? 0;
  const label = SERVICE_LABELS[serviceType] ?? sessionData.service_type;
  const origin = new URL(request.url).origin;

  // Create Stripe Checkout session
  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: price,
          product_data: {
            name: label,
            description: `${sessionData.date} · ${formatTime(sessionData.start_time)}–${formatTime(sessionData.end_time)} · ${String(dog_name).trim()}`,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: String(customer_email).trim().toLowerCase(),
    metadata: {
      booking_id: String(booking.id),
      booking_code: booking.confirmation_code,
    },
    success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking?payment=cancelled`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  return Response.json({ url: checkoutSession.url }, { status: 201 });
}
