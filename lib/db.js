import Database from "better-sqlite3";

const seedEvents = [
  { id: 1, title: "IFRS Update", date: "2026-12-05", capacity: 3, cpdHours: 6 },
  { id: 2, title: "Public Sector Auditing", date: "2026-12-12", capacity: 2, cpdHours: 4 },
  { id: 3, title: "Ethics for Accountants", date: "2026-01-09", capacity: 5, cpdHours: 3 },
];

export function openDb(file) {
  const db = new Database(file);

  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      cpd_hours INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL REFERENCES events(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (event_id, email)
    );
  `);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM events").get();
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO events (id, title, date, capacity, cpd_hours) VALUES (@id, @title, @date, @capacity, @cpdHours)"
    );
    for (const event of seedEvents) insert.run(event);
  }

  return db;
}

let db;

export function getDb() {
  if (!db) db = openDb(process.env.DB_PATH || "cpd.db");
  return db;
}
