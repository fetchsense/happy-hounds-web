import nodemailer from "nodemailer";
import type { BookingWithSession } from "@/lib/bookings";
import { SERVICE_LABELS } from "@/lib/session-types";
import type { ServiceType } from "@/lib/session-types";

const STAFF_EMAIL = "happyhoundstrainingacademy@gmail.com";

function getTransporter() {
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!pass) return null;
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: STAFF_EMAIL, pass },
  });
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

export async function sendBookingEmails(booking: BookingWithSession): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] EMAIL_APP_PASSWORD not set — skipping booking confirmation emails");
    return;
  }

  const service = SERVICE_LABELS[booking.service_type as ServiceType] ?? booking.service_type;
  const date = formatDate(booking.session_date);
  const time = `${formatTime(booking.session_start)} – ${formatTime(booking.session_end)}`;

  const customerText = `
Hi ${booking.customer_name},

Your booking is confirmed! Here are your details:

  Confirmation code:  ${booking.confirmation_code}
  Service:            ${service}
  Date:               ${date}
  Time:               ${time}
  Dog:                ${booking.dog_name} (${booking.dog_breed})

What to bring on the day
  - Your confirmation code: ${booking.confirmation_code}
  - Payment (card or cash accepted on the day)
  - Any food or treats ${booking.dog_name} needs
  - Up-to-date vaccination records if this is ${booking.dog_name}'s first visit

Need to cancel or change your booking?
Email us at least 24 hours in advance at ${STAFF_EMAIL}
with your confirmation code and we'll sort it out.

See you soon,
Happy Hounds Activity Centre
  `.trim();

  const staffText = `
New booking — ${booking.confirmation_code}

  Service:  ${service}
  Date:     ${date}
  Time:     ${time}
  Customer: ${booking.customer_name} <${booking.customer_email}>
  Dog:      ${booking.dog_name} (${booking.dog_breed})
${booking.notes ? `  Notes:    ${booking.notes}\n` : ""}
  `.trim();

  await Promise.all([
    transporter.sendMail({
      from: `"Happy Hounds Activity Centre" <${STAFF_EMAIL}>`,
      to: booking.customer_email,
      subject: `Booking confirmed — ${booking.confirmation_code}`,
      text: customerText,
    }),
    transporter.sendMail({
      from: `"Happy Hounds Booking System" <${STAFF_EMAIL}>`,
      to: STAFF_EMAIL,
      subject: `New booking: ${booking.dog_name} — ${service}, ${date}`,
      text: staffText,
    }),
  ]);
}
