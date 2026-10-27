# Code : 03

# ETiCPA CPD Events

A small app for ETiCPA's CPD training events. Members can see what's coming up and grab a seat, and admins can check who has registered.

Next.js and SQLite.

## To Get started

```bash
npm install
cp .env.example .env.local
npm run dev
```

http://localhost:3000 to see the events page.

The database file (`cpd.db`) is created automatically on first run and filled with the seed events.

## Run the tests

```bash
npm test
```

They cover a successful registration, missing name, invalid email, duplicate email, a full event and an unknown event.

## API

### `GET /api/events`

Lists all events, each with a `seatsLeft` field.

### `POST /api/events/:id/register`

Body: `{ "name": "...", "email": "..." }`

| Result                                  | Status |
| --------------------------------------- | ------ |
| Registered                              | 201    |
| Name missing or email not valid         | 400    |
| Event doesn't exist                     | 404    |
| Email already registered for this event | 409    |
| Event is full                           | 409    |

Emails are compared without case, so `Sara@x.com` and `sara@x.com` count as the same person.

### `GET /api/events/:id/registrations`

Admin only. Send the `x-admin-key` header matching `ADMIN_KEY` from the env, otherwise we will get a 401.

```bash
curl http://localhost:3000/api/events/1/registrations -H "x-admin-key: secret123"
```

## Project layout

```
app/page.js          events page
app/api/events/...   API routes
lib/db.js            SQLite setup and seed data
lib/events.js        registration rules
tests/               automated tests
```
