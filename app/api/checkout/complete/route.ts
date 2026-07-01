import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { confirmBookingPayment, getBookingById } from "@/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/booking?payment=error", origin));
  }

  let checkoutSession;
  try {
    checkoutSession = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.redirect(new URL("/booking?payment=error", origin));
  }

  if (checkoutSession.payment_status !== "paid") {
    // Payment incomplete — send back to booking with a message
    return NextResponse.redirect(new URL("/booking?payment=cancelled", origin));
  }

  const bookingId = Number(checkoutSession.metadata?.booking_id);
  const bookingCode = checkoutSession.metadata?.booking_code;

  if (!bookingId || !bookingCode) {
    return NextResponse.redirect(new URL("/booking?payment=error", origin));
  }

  // Confirm booking (idempotent: if already confirmed, just redirect)
  const existing = getBookingById(bookingId);
  if (existing?.status !== "confirmed") {
    confirmBookingPayment(bookingId, sessionId);
  }

  return NextResponse.redirect(new URL(`/booking/confirmation/${bookingCode}`, origin));
}
