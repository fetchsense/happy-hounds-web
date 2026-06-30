import type { NextRequest } from "next/server";
import { getSessions, seedSessionsIfEmpty } from "@/lib/sessions";

export const runtime = "nodejs";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  seedSessionsIfEmpty();

  const sp = request.nextUrl.searchParams;
  const from = sp.get("from") ?? new Date().toISOString().slice(0, 10);
  const to = sp.get("to") ?? addDays(from, 30);

  const sessions = getSessions(from, to);
  return Response.json(sessions);
}
