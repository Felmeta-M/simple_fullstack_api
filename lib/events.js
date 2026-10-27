const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function listEvents(db) {
  return db
    .prepare(
      `SELECT e.id, e.title, e.date, e.capacity, e.cpd_hours AS cpdHours,
              e.capacity - COUNT(r.id) AS seatsLeft
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       GROUP BY e.id
       ORDER BY e.date`
    )
    .all();
}

function findEvent(db, eventId) {
  return listEvents(db).find((event) => event.id === Number(eventId));
}

export function registerForEvent(db, eventId, input) {
  const event = findEvent(db, eventId);
  if (!event) return { status: 404, body: { error: "Event not found" } };

  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";

  if (!name) return { status: 400, body: { error: "Name is required" } };
  if (!EMAIL_PATTERN.test(email)) return { status: 400, body: { error: "Email is not valid" } };

  const alreadyRegistered = db
    .prepare("SELECT 1 FROM registrations WHERE event_id = ? AND email = ?")
    .get(event.id, email);
  if (alreadyRegistered) {
    return { status: 409, body: { error: "This email is already registered for this event" } };
  }

  if (event.seatsLeft <= 0) return { status: 409, body: { error: "Event is full" } };

  const result = db
    .prepare("INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)")
    .run(event.id, name, email);

  return {
    status: 201,
    body: { id: result.lastInsertRowid, eventId: event.id, name, email },
  };
}

export function listRegistrations(db, eventId) {
  const event = findEvent(db, eventId);
  if (!event) return null;

  return db
    .prepare(
      `SELECT id, name, email, created_at AS createdAt
       FROM registrations WHERE event_id = ? ORDER BY id`
    )
    .all(event.id);
}
