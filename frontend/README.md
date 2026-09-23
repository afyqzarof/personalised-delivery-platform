# KatKin — Your Next Delivery (frontend)

React 19 + TypeScript + Vite app that renders a customer's next delivery card at
`/welcome/:userId`, fetched from the KatKin backend.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed URL and visit **`/welcome/:userId`**, e.g.
`http://localhost:5173/welcome/<a-valid-user-uuid>`.

The app expects the **backend running on `http://localhost:3000`** and calls:

```
GET http://localhost:3000/comms/your-next-delivery/:userId
-> { title, message, totalPrice (pounds), freeGift }
```

## Configuration

The API base URL is read from the `VITE_API_BASE_URL` env var and defaults to
`http://localhost:3000`. To point the app at a different backend, create a
`.env.local` (see `.env.example`):

```bash
VITE_API_BASE_URL=https://my-backend.example.com
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (HMR). |
| `npm run build` | Type-check and build for production. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the Vitest unit tests once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Structure

- `src/api/client.ts` — typed `fetch` client (base URL from env, `ApiError`).
- `src/hooks/useDelivery.ts` — data-fetching hook exposing an explicit
  `{ status: 'loading' | 'error' | 'success', data, error }` state.
- `src/components/DeliveryCard.tsx` — presentational card (no fetching).
- `src/pages/WelcomePage.tsx` — wires the route param to the hook and renders
  loading / error / success UI.
- `src/lib/format.ts` — `£` money formatting helper.
- `src/styles/theme.css` — KatKin brand tokens (green / pink).

## Notes

- The **See details** and **Edit delivery** buttons are non-functional
  placeholders, per the design brief.
- `404` from the API renders "We couldn't find that account"; `400` renders a
  bad-link message; other failures render a generic error.
