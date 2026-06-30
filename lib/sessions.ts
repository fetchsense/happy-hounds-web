import { getDb } from "./db";
import type { ServiceType } from "./session-types";

export type { ServiceType };
export {
  SERVICE_LABELS,
  SERVICE_TIMES,
  SERVICE_PRICES_PENCE,
  SERVICE_ORDER,
  SERVICE_DESCRIPTIONS,
} from "./session-types";

export interface Session {
  id: number;
  service_type: ServiceType;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked: number;
  available: number;
}

export function getSessions(from: string, to: string): Session[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT s.*,
      CAST(COUNT(b.id) AS INTEGER) AS booked
    FROM sessions s
    LEFT JOIN bookings b ON b.session_id = s.id AND b.status = 'confirmed'
    WHERE s.date >= ? AND s.date <= ?
    GROUP BY s.id
    ORDER BY s.date, s.start_time, s.service_type
  `
    )
    .all(from, to) as (Session & { booked: number })[];

  return rows.map((r) => ({
    ...r,
    available: r.capacity - r.booked,
  }));
}

export function getSessionById(id: number): Session | null {
  const db = getDb();
  const row = db
    .prepare(
      `
    SELECT s.*,
      CAST(COUNT(b.id) AS INTEGER) AS booked
    FROM sessions s
    LEFT JOIN bookings b ON b.session_id = s.id AND b.status = 'confirmed'
    WHERE s.id = ?
    GROUP BY s.id
  `
    )
    .get(id) as (Session & { booked: number }) | undefined;

  if (!row) return null;
  return { ...row, available: row.capacity - row.booked };
}

export function seedSessionsIfEmpty() {
  const db = getDb();
  const { n } = db
    .prepare("SELECT COUNT(*) AS n FROM sessions")
    .get() as { n: number };
  if (n > 0) return;

  const today = new Date();
  const toInsert: {
    type: string;
    date: string;
    start: string;
    end: string;
    cap: number;
  }[] = [];

  for (let i = 1; i <= 42; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay(); // 0=Sun, 6=Sat
    if (dow === 0) continue; // closed Sundays

    const dateStr = d.toISOString().slice(0, 10);

    // Group sessions — Mon to Sat
    toInsert.push({ type: "daycare", date: dateStr, start: "08:00", end: "18:00", cap: 6 });
    toInsert.push({ type: "play_am", date: dateStr, start: "08:00", end: "12:00", cap: 6 });
    toInsert.push({ type: "play_pm", date: dateStr, start: "13:00", end: "17:00", cap: 6 });

    // Enrichment — Mon to Fri only
    if (dow >= 1 && dow <= 5) {
      toInsert.push({ type: "enrichment", date: dateStr, start: "10:00", end: "11:00", cap: 6 });
    }

    // Training — Tue, Thu, Sat (3 slots each day)
    if (dow === 2 || dow === 4 || dow === 6) {
      toInsert.push({ type: "training", date: dateStr, start: "10:00", end: "11:00", cap: 1 });
      toInsert.push({ type: "training", date: dateStr, start: "11:00", end: "12:00", cap: 1 });
      toInsert.push({ type: "training", date: dateStr, start: "14:00", end: "15:00", cap: 1 });
    }
  }

  const insert = db.prepare(
    "INSERT INTO sessions (service_type, date, start_time, end_time, capacity) VALUES (?, ?, ?, ?, ?)"
  );
  db.transaction(() => {
    for (const s of toInsert) {
      insert.run(s.type, s.date, s.start, s.end, s.cap);
    }
  })();
}
