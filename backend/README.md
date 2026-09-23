# KatKin backend — Personalised delivery messaging

NestJS service that returns personalised "your next delivery" messaging for a user.

## Requirements

- Node (see `.nvmrc`)
- Yarn

## Install & run

```bash
yarn install
yarn start        # http://localhost:3000  (use yarn start:dev to watch)
```

CORS is enabled for the Vite frontend at `http://localhost:5173`.

## Endpoint

```
GET /comms/your-next-delivery/:userId
```

`:userId` must be a UUID.

- **200** — personalised delivery payload (see below)
- **400** — `:userId` is not a valid UUID (`ParseUUIDPipe`)
- **404** — no user with that id

### Response shape

```json
{
  "title": "Your next delivery for <active cat names>",
  "message": "Hey <firstName>! In two days' time, we'll be charging you for your next order for <active cat names>'s fresh food.",
  "totalPrice": 69,
  "freeGift": false
}
```

Only cats with `subscriptionActive === true` count toward names, title, message and price.
Names read as `A`, `A and B`, or `A, B and C`. `totalPrice` is summed in integer pence per
pouch size then converted to pounds. `freeGift` is `true` only when `totalPrice` is strictly
greater than £120.

### Example (curl)

```bash
curl http://localhost:3000/comms/your-next-delivery/618f4ed6-1c5b-4993-a149-f64700bf31dd
```

```json
{
  "title": "Your next delivery for Betsy",
  "message": "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
  "totalPrice": 69,
  "freeGift": false
}
```

Example user ids:

- `618f4ed6-1c5b-4993-a149-f64700bf31dd` (Cordell) — `freeGift: false` (£69.00)
- `33b449a6-d92b-4609-9910-69a8979a04b2` (Pete) — `freeGift: true` (£137.25)

## Architecture

- `src/users/` — data-access layer. `UsersRepository` interface hides the source;
  `JsonUsersRepository` parses `data.json` once at startup and indexes by id.
- `src/comms/` — `CommsController` (HTTP + validation) and `CommsService` (orchestration).
- `src/comms/comms.messaging.ts` — pure, framework-free helpers (`formatCatNames`,
  `calcTotalPence`, `penceToPounds`, `isFreeGift`, `buildTitle`, `buildMessage`).

## Tests

```bash
yarn test
```

Covers the pure messaging functions (name grammar, price sums, the £120 gift boundary),
the service via a stubbed repository, and one supertest end-to-end pass through the HTTP
layer (200 / 404 / 400).
