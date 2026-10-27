"use client";

import { useEffect, useState } from "react";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function EventCard({ event, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);

  const isFull = event.seatsLeft <= 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    const res = await fetch(`/api/events/${event.id}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage({ ok: true, text: "You're registered. See you there!" });
      setName("");
      setEmail("");
      onRegistered();
    } else {
      setMessage({ ok: false, text: data.error });
    }
    setSending(false);
  }

  return (
    <li className="card">
      <h2>{event.title}</h2>
      <p className="meta">
        {formatDate(event.date)} · {event.cpdHours} CPD hours
      </p>
      <p className={isFull ? "seats full" : "seats"}>
        {isFull ? "Fully booked" : `${event.seatsLeft} of ${event.capacity} seats left`}
      </p>

      {!isFull && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={sending}>{sending ? "Registering..." : "Register"}</button>
        </form>
      )}

      {message && <p className={message.ok ? "ok" : "error"}>{message.text}</p>}
    </li>
  );
}

export default function Home() {
  const [events, setEvents] = useState(null);

  async function loadEvents() {
    const res = await fetch("/api/events");
    setEvents(await res.json());
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main>
      <h1>ETiCPA CPD Events</h1>
      <p className="intro">Pick an event and save your seat. Places are limited.</p>

      {!events && <p>Loading events...</p>}
      {events && (
        <ul className="events">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRegistered={loadEvents} />
          ))}
        </ul>
      )}
    </main>
  );
}
