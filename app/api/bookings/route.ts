import type { NextRequest } from "next/server";
import { createBooking, getBookingByCode } from "@/lib/bookings";
import { sendBookingEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stub for static export (GitHub Pages) — real bookings require server-side POST
export async function GET() {
  return Response.json({ error: "not available" }, { status: 405 });
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

  if (
    typeof customer_email !== "string" ||
    !customer_email.includes("@")
  ) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const result = createBooking({
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

  // Fire-and-forget: email failure must not block or fail the booking response
  const full = getBookingByCode(result.booking.confirmation_code);
  if (full) {
    sendBookingEmails(full).catch((err) =>
      console.error("[email] Failed to send booking emails:", err)
    );
  }

  return Response.json({ booking: result.booking }, { status: 201 });
}
