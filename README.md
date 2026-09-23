# Your Next Delivery

A personalised, channel-agnostic communications service. It looks up a customer's
data and renders a tailored "your next delivery" message that can back an email,
SMS, or web page.

The repo has two independent parts:

- **`backend/`** — a NestJS + TypeScript REST API exposing
  `GET /comms/your-next-delivery/:userId`.
- **`frontend/`** — a React 19 + Vite app with a single page, `/welcome/:userId`,
  that calls the API and renders the message as a card.

Each project has its own dependencies and scripts. The frontend has its own
[README](frontend/README.md) with more detail.

## Prerequisites

- Node.js 18 or later
- Yarn

## Quick start

Run the backend and frontend in two terminals.

**1. Backend** (serves on `http://localhost:3000`):

```bash
cd backend
yarn install
yarn start
```

**2. Frontend** (dev server on `http://localhost:5173`):

```bash
cd frontend
yarn install
yarn dev
```

Then open `http://localhost:5173/welcome/<user-uuid>`, e.g.
`http://localhost:5173/welcome/ff535484-6880-4653-b06e-89983ecf4ed5`.

Valid user UUIDs come from `backend/data.json`, which stands in for a database.

## The API

```
GET /comms/your-next-delivery/:userId
```

Returns the delivery payload for a user:

```jsonc
{
  "title": "Your next delivery for Dorian and Ocie",
  "message": "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
  "totalPrice": 134,   // pounds
  "freeGift": true     // true when totalPrice exceeds £120
}
```

Behaviour:

- **Cat names** are only the customer's *active* cats, formatted grammatically:
  `A`, `A and B`, or `A, B and C`.
- **`totalPrice`** is the sum of each active cat's pouch-size price (A–F).
  Prices are computed in integer pence and converted to pounds once, so totals
  are exact.
- **`freeGift`** is `true` when the total exceeds £120.
- A malformed id returns **400**; an unknown user returns **404**.

### Pouch-size prices

| Size | Price (GBP) |
| ---- | ----------- |
| A | 55.50 |
| B | 59.50 |
| C | 62.75 |
| D | 66.00 |
| E | 69.00 |
| F | 71.25 |

## Configuration

- **Backend** — `PORT` (default `3000`) and `FRONTEND_ORIGIN` (comma-separated
  CORS allowlist; reflects the request origin if unset). See `backend/.env.example`.
- **Frontend** — `VITE_API_BASE_URL` (default `http://localhost:3000`). See
  `frontend/.env.example`.

## Tests

```bash
cd backend  && yarn test   # Jest
cd frontend && yarn test   # Vitest
```

## Project layout

```
backend/
  src/comms/       # controller, service, and messaging/pricing logic
  src/users/       # user types + JSON-file-backed repository
  data.json        # user data (stands in for a database)
frontend/
  src/pages/       # WelcomePage (/welcome/:userId)
  src/hooks/       # useDelivery (TanStack Query)
  src/components/  # DeliveryCard (presentational)
```

## Possible improvements

Given the scope this was deliberately kept simple. With more time:

- **CI** — a GitHub Actions workflow running install, lint, type-check, build,
  and tests for both projects on every push/PR, so `main` stays green.
- **Per-cat imagery** — show each cat on the delivery card (name + a photo)
  instead of a single generic hero image, and drive the copy from the same data.
- **Shared types** — publish the `NextDeliveryDto` contract from a shared package
  (or generate it from an OpenAPI spec) so the frontend and backend can't drift.
- **Config-driven pricing** — move pouch prices and the free-gift threshold into
  configuration rather than constants in code.
- **E2E coverage** — a Playwright test that loads `/welcome/:userId` against a
  running backend and asserts the rendered card.
- **Observability** — structured logging, request tracing, and a `/health`
  endpoint for deployment.
- **Containerisation** — a `docker-compose` to run both services together.

## A note on AI usage

AI tools were used while building this project — for scaffolding, drafting tests
and this documentation, and as a review aid. All code has been read, understood,
and verified by hand: the backend and frontend build, lint, and test cleanly, and
the API output was checked against the examples in the brief. I'm happy to walk
through any part of the implementation and the reasoning behind it.
