# Your Next Delivery (frontend)

React 19 + TypeScript + Vite app that renders a customer's next delivery card at
`/welcome/:userId`, fetched from the backend.

## Getting started

```bash
yarn install
yarn dev
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

The backend must be running for the app to load a delivery; there is no mock
mode. A malformed uuid returns 400 and an unknown user returns 404, both of
which the app renders as a friendly error.

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start the dev server (HMR). |
| `yarn build` | Type-check and build for production. |
| `yarn preview` | Preview the production build. |
| `yarn lint` | Run ESLint. |
| `yarn test` | Run the Vitest unit tests once. |
| `yarn test:watch` | Run Vitest in watch mode. |

## Structure

- `src/api/client.ts` — typed `fetch` client (base URL from env, `ApiError`).
- `src/hooks/useDelivery.ts` — TanStack Query hook (`useQuery`) normalised into
  an explicit `{ status: 'loading' | 'error' | 'success', data, error }` state;
  the `QueryClientProvider` lives in `src/App.tsx`.
- `src/components/DeliveryCard.tsx` — presentational card (no fetching).
- `src/pages/WelcomePage.tsx` — wires the route param to the hook and renders
  loading / error / success UI.
- `src/lib/format.ts` — `£` money formatting helper.
- `src/index.css` — Tailwind entry + brand tokens (primary / secondary) via `@theme`.

Styling uses **Tailwind CSS v4** (via `@tailwindcss/vite`); brand colours are
exposed as utilities such as `bg-primary` and `text-secondary-text`.

## Notes

- The **See details** and **Edit delivery** buttons are non-functional
  placeholders, per the design brief.
- `404` from the API renders "We couldn't find that account"; `400` renders a
  bad-link message; other failures render a generic error.
