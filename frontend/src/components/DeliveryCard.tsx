import type { DeliveryResponse } from '../types/delivery'
import { formatGbp } from '../lib/format'
import heroImg from '../assets/hero.png'

interface DeliveryCardProps {
  delivery: DeliveryResponse
}

const buttonBase =
  'rounded-md border-2 border-katkin-green px-6 py-3 text-[13px] font-bold uppercase tracking-wider cursor-pointer'

/**
 * Presentational card for a user's next delivery. Purely driven by props —
 * it does no fetching. The two buttons are non-functional placeholders per
 * the design brief.
 */
export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const { title, message, totalPrice, freeGift } = delivery

  return (
    <article className="mx-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-xl bg-white text-left shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:max-w-[900px] md:flex-row">
      <img
        className="block h-[220px] w-full object-cover md:h-auto md:w-[45%] md:self-stretch"
        src={heroImg}
        alt="Your cat's food delivery"
      />

      <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
        <h1 className="text-[22px] font-bold leading-tight text-katkin-green md:text-2xl">
          {title}
        </h1>
        <p className="text-[15px] leading-relaxed text-card-text">{message}</p>

        <p className="text-[15px] text-card-text">
          <span className="font-bold">Total price:</span> {formatGbp(totalPrice)}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${buttonBase} bg-katkin-green text-white hover:border-katkin-green-dark hover:bg-katkin-green-dark`}
          >
            See details
          </button>
          <button
            type="button"
            className={`${buttonBase} bg-transparent text-katkin-green hover:bg-katkin-green/5`}
          >
            Edit delivery
          </button>

          {freeGift && (
            <span
              data-testid="free-gift"
              className="-rotate-6 self-center rounded bg-katkin-pink px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wider text-katkin-pink-text shadow-md"
            >
              Free gift
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
