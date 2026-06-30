import type { NextRequest } from "next/server";
import { getAllUpcomingBookings, getBookingsByDate } from "@/lib/bookings";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const bookings = date ? getBookingsByDate(date) : getAllUpcomingBookings();
  return Response.json(bookings);
}
