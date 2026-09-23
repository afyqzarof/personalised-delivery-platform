import { useParams } from 'react-router-dom'
import { DeliveryCard } from '../components/DeliveryCard'
import { useDelivery } from '../hooks/useDelivery'

/** Maps an API error status to friendly user-facing copy. */
function errorCopy(status: number): string {
  switch (status) {
    case 404:
      return "We couldn't find that account."
    case 400:
      return "That account link doesn't look right."
    default:
      return 'Something went wrong while loading your delivery.'
  }
}

export function WelcomePage() {
  const { userId } = useParams<{ userId: string }>()
  const state = useDelivery(userId)

  return (
    <main className="flex min-h-[100svh] items-center justify-center p-6">
      {state.status === 'loading' && (
        <div
          className="flex flex-col items-center gap-3 text-center text-card-text"
          role="status"
          aria-live="polite"
        >
          <span
            className="size-9 animate-spin rounded-full border-4 border-katkin-green/20 border-t-katkin-green motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p>Loading your next delivery…</p>
        </div>
      )}

      {state.status === 'error' && (
        <div
          className="flex flex-col items-center gap-3 text-center text-card-text"
          role="alert"
        >
          <p className="text-xl font-bold text-katkin-green">
            {errorCopy(state.error.status)}
          </p>
          <p className="text-sm">Please check the link or try again later.</p>
        </div>
      )}

      {state.status === 'success' && <DeliveryCard delivery={state.data} />}
    </main>
  )
}
