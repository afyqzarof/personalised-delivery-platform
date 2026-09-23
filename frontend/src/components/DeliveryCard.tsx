import type { DeliveryResponse } from '../types/delivery'
import { formatGbp } from '../lib/format'
import heroImg from '../assets/hero.png'
import styles from './DeliveryCard.module.css'

interface DeliveryCardProps {
  delivery: DeliveryResponse
}

/**
 * Presentational card for a user's next delivery. Purely driven by props —
 * it does no fetching. The two buttons are non-functional placeholders per
 * the design brief.
 */
export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const { title, message, totalPrice, freeGift } = delivery

  return (
    <article className={styles.card}>
      <img className={styles.hero} src={heroImg} alt="Your cat's food delivery" />

      <div className={styles.body}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>

        <p className={styles.price}>
          <span className={styles.priceLabel}>Total price:</span>{' '}
          {formatGbp(totalPrice)}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            See details
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Edit delivery
          </button>

          {freeGift && (
            <span className={styles.gift} data-testid="free-gift">
              Free gift
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
