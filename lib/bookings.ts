import { getDb } from "./db";
import { getSessionById } from "./sessions";

export interface Booking {
  id: number;
  session_id: number;
  confirmation_code: string;
  idempotency_key: string | null;
  customer_name: string;
  customer_email: string;
  dog_name: string;
  dog_breed: string;
  notes: string | null;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
}

export interface BookingWithSession extends Booking {
  session_date: string;
  session_start: string;
  session_end: string;
  service_type: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HH-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export interface CreateBookingInput {
  session_id: number;
  customer_name: string;
  customer_email: string;
  dog_name: string;
  dog_breed: string;
  notes?: string;
  idempotency_key?: string;
}

export type BookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: "SESSION_NOT_FOUND" | "FULLY_BOOKED" };

export function createBooking(input: CreateBookingInput): BookingResult {
  const db = getDb();

  // Idempotency: return existing booking if same key was used before
  if (input.idempotency_key) {
    const existing = db
      .prepare("SELECT * FROM bookings WHERE idempotency_key = ?")
      .get(input.idempotency_key) as Booking | undefined;
    if (existing) return { ok: true, booking: existing };
  }

  const session = getSessionById(input.session_id);
  if (!session) return { ok: false, error: "SESSION_NOT_FOUND" };

  let result: BookingResult = { ok: false, error: "FULLY_BOOKED" };

  db.transaction(() => {
    // Re-check capacity inside transaction to prevent race conditions
    const { n } = db
      .prepare(
        "SELECT COUNT(*) AS n FROM bookings WHERE session_id = ? AND status = 'confirmed'"
      )
      .get(input.session_id) as { n: number };

    if (n >= session.capacity) return;

    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      if (++attempts > 20) throw new Error("Could not generate unique code");
    } while (
      db.prepare("SELECT id FROM bookings WHERE confirmation_code = ?").get(code)
    );

    db.prepare(
      `INSERT INTO bookings
        (session_id, confirmation_code, idempotency_key,
         customer_name, customer_email, dog_name, dog_breed, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      input.session_id,
      code!,
      input.idempotency_key ?? null,
      input.customer_name,
      input.customer_email,
      input.dog_name,
      input.dog_breed,
      input.notes ?? null
    );

    const booking = db
      .prepare("SELECT * FROM bookings WHERE confirmation_code = ?")
      .get(code!) as Booking;
    result = { ok: true, booking };
  })();

  return result;
}

export function getBookingByCode(code: string): BookingWithSession | null {
  const db = getDb();
  return (
    (db
      .prepare(
        `SELECT b.*,
          s.date       AS session_date,
          s.start_time AS session_start,
          s.end_time   AS session_end,
          s.service_type
         FROM bookings b
         JOIN sessions s ON s.id = b.session_id
         WHERE b.confirmation_code = ?`
      )
      .get(code) as BookingWithSession | undefined) ?? null
  );
}

export function getBookingsByDate(date: string): BookingWithSession[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT b.*,
        s.date       AS session_date,
        s.start_time AS session_start,
        s.end_time   AS session_end,
        s.service_type
       FROM bookings b
       JOIN sessions s ON s.id = b.session_id
       WHERE s.date = ? AND b.status = 'confirmed'
       ORDER BY s.start_time, b.customer_name`
    )
    .all(date) as BookingWithSession[];
}

export function getAllUpcomingBookings(): BookingWithSession[] {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  return db
    .prepare(
      `SELECT b.*,
        s.date       AS session_date,
        s.start_time AS session_start,
        s.end_time   AS session_end,
        s.service_type
       FROM bookings b
       JOIN sessions s ON s.id = b.session_id
       WHERE s.date >= ? AND b.status = 'confirmed'
       ORDER BY s.date, s.start_time, b.customer_name`
    )
    .all(today) as BookingWithSession[];
}

// ── Stripe payment flow ────────────────────────────────────────────────────────

export type PendingBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: "SESSION_NOT_FOUND" | "FULLY_BOOKED" };

/**
 * Creates a booking in 'pending_payment' status before redirecting to Stripe.
 * Counts both confirmed and pending_payment bookings toward capacity so users
 * can't start checkout for an already-contested last slot.
 */
export function createPendingBooking(input: CreateBookingInput): PendingBookingResult {
  const db = getDb();

  // Idempotency: if a booking with this key already exists, return it
  if (input.idempotency_key) {
    const existing = db
      .prepare("SELECT * FROM bookings WHERE idempotency_key = ?")
      .get(input.idempotency_key) as Booking | undefined;
    if (existing) return { ok: true, booking: existing };
  }

  const session = getSessionById(input.session_id);
  if (!session) return { ok: false, error: "SESSION_NOT_FOUND" };

  let result: PendingBookingResult = { ok: false, error: "FULLY_BOOKED" };

  db.transaction(() => {
    const { n } = db
      .prepare(
        "SELECT COUNT(*) AS n FROM bookings WHERE session_id = ? AND status IN ('confirmed', 'pending_payment')"
      )
      .get(input.session_id) as { n: number };

    if (n >= session.capacity) return;

    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      if (++attempts > 20) throw new Error("Could not generate unique code");
    } while (
      db.prepare("SELECT id FROM bookings WHERE confirmation_code = ?").get(code)
    );

    db.prepare(
      `INSERT INTO bookings
        (session_id, confirmation_code, idempotency_key,
         customer_name, customer_email, dog_name, dog_breed, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')`
    ).run(
      input.session_id,
      code!,
      input.idempotency_key ?? null,
      input.customer_name,
      input.customer_email,
      input.dog_name,
      input.dog_breed,
      input.notes ?? null
    );

    const booking = db
      .prepare("SELECT * FROM bookings WHERE confirmation_code = ?")
      .get(code!) as Booking;
    result = { ok: true, booking };
  })();

  return result;
}

/**
 * Marks a pending booking as confirmed after Stripe payment succeeds.
 * Idempotent: safe to call twice for the same booking.
 */
export function confirmBookingPayment(bookingId: number, stripeSessionId: string): Booking | null {
  const db = getDb();
  db.prepare(
    "UPDATE bookings SET status = 'confirmed', stripe_session_id = ? WHERE id = ? AND status = 'pending_payment'"
  ).run(stripeSessionId, bookingId);
  return (db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as Booking | undefined) ?? null;
}

export function getBookingById(id: number): Booking | null {
  const db = getDb();
  return (db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as Booking | undefined) ?? null;
}
