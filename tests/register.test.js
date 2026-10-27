import { beforeEach, describe, expect, it } from "vitest";
import { openDb } from "../lib/db.js";
import { registerForEvent } from "../lib/events.js";

let db;

beforeEach(() => {
  // fresh in-memory database with the seed events for every test
  db = openDb(":memory:");
});

describe("registering for an event", () => {
  it("registers a member and returns 201", () => {
    const result = registerForEvent(db, 1, { name: "Abebe", email: "abebe@example.com" });
    expect(result.status).toBe(201);
  });

  it("rejects a missing name with 400", () => {
    const result = registerForEvent(db, 1, { name: "  ", email: "abebe@example.com" });
    expect(result.status).toBe(400);
  });

  it("rejects an invalid email with 400", () => {
    const result = registerForEvent(db, 1, { name: "Abebe", email: "not-an-email" });
    expect(result.status).toBe(400);
  });

  it("rejects the same email twice with 409", () => {
    registerForEvent(db, 1, { name: "Abebe", email: "abebe@example.com" });
    const result = registerForEvent(db, 1, { name: "Abebe", email: "ABEBE@example.com" });
    expect(result.status).toBe(409);
  });

  it("rejects a registration when the event is full with 409", () => {
    // event 1 has 3 seats
    registerForEvent(db, 1, { name: "A", email: "a@example.com" });
    registerForEvent(db, 1, { name: "B", email: "b@example.com" });
    registerForEvent(db, 1, { name: "C", email: "c@example.com" });

    const result = registerForEvent(db, 1, { name: "D", email: "d@example.com" });
    expect(result.status).toBe(409);
    expect(result.body.error).toBe("Event is full");
  });

  it("returns 404 for an unknown event", () => {
    const result = registerForEvent(db, 999, { name: "Abebe", email: "abebe@example.com" });
    expect(result.status).toBe(404);
  });
});
