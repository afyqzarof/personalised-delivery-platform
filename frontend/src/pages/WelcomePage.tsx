import { useParams } from 'react-router-dom'
import { DeliveryCard } from '../components/DeliveryCard'
import { useDelivery } from '../hooks/useDelivery'
import styles from './WelcomePage.module.css'

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
    <main className={styles.page}>
      {state.status === 'loading' && (
        <div className={styles.status} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Loading your next delivery…</p>
        </div>
      )}

      {state.status === 'error' && (
        <div className={styles.status} role="alert">
          <p className={styles.errorTitle}>{errorCopy(state.error.status)}</p>
          <p className={styles.errorDetail}>
            Please check the link or try again later.
          </p>
        </div>
      )}

      {state.status === 'success' && <DeliveryCard delivery={state.data} />}
    </main>
  )
}
