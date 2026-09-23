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

### Mock mode

Until the backend is available the client serves a **stubbed response**, so the
page works standalone. This is on by default; set `VITE_USE_MOCK_API=false` to
hit the real API. The mock also mirrors the error cases — a malformed uuid
returns 400, and the all-zero uuid
(`00000000-0000-0000-0000-000000000000`) returns 404, which is handy for
previewing the error UI.

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
- `src/hooks/useDelivery.ts` — TanStack Query hook (`useQuery`) normalised into
  an explicit `{ status: 'loading' | 'error' | 'success', data, error }` state;
  the `QueryClientProvider` lives in `src/App.tsx`.
- `src/components/DeliveryCard.tsx` — presentational card (no fetching).
- `src/pages/WelcomePage.tsx` — wires the route param to the hook and renders
  loading / error / success UI.
- `src/lib/format.ts` — `£` money formatting helper.
- `src/index.css` — Tailwind entry + KatKin brand tokens (green / pink) via `@theme`.

Styling uses **Tailwind CSS v4** (via `@tailwindcss/vite`); brand colours are
exposed as utilities such as `bg-katkin-green` and `text-katkin-pink-text`.

## Notes

- The **See details** and **Edit delivery** buttons are non-functional
  placeholders, per the design brief.
- `404` from the API renders "We couldn't find that account"; `400` renders a
  bad-link message; other failures render a generic error.
