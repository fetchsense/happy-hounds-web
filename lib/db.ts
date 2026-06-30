import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "bookings.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type TEXT NOT NULL,
      date        TEXT NOT NULL,
      start_time  TEXT NOT NULL,
      end_time    TEXT NOT NULL,
      capacity    INTEGER NOT NULL DEFAULT 6,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);

    CREATE TABLE IF NOT EXISTS bookings (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id        INTEGER NOT NULL REFERENCES sessions(id),
      confirmation_code TEXT NOT NULL UNIQUE,
      idempotency_key   TEXT UNIQUE,
      customer_name     TEXT NOT NULL,
      customer_email    TEXT NOT NULL,
      dog_name          TEXT NOT NULL,
      dog_breed         TEXT NOT NULL,
      notes             TEXT,
      status            TEXT NOT NULL DEFAULT 'confirmed',
      created_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_code    ON bookings(confirmation_code);
  `);
}
