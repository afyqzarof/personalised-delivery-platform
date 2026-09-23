import type { DeliveryResponse } from "../types/delivery";
import { formatGbp } from "../lib/format";

interface DeliveryCardProps {
  delivery: DeliveryResponse;
}

const buttonBase =
  "rounded-md border-2 border-primary px-6 py-3 text-sm font-bold uppercase tracking-wider cursor-pointer";

/**
 * Presentational card for a user's next delivery. Purely driven by props —
 * it does no fetching. The two buttons are non-functional placeholders per
 * the design brief.
 */
export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const { title, message, totalPrice, freeGift } = delivery;

  return (
    <article className="mx-auto flex w-full max-w-190 flex-col overflow-hidden rounded-xl bg-white text-left  border border-solid border-gray-700 md:max-w-225 md:flex-row">
      <img
        className="block h-55 w-full object-cover object-center md:h-auto md:w-2/5 md:self-stretch"
        src="https://cataas.com/cat?width=1000&height=1000"
        alt="Your cat's food delivery"
      />

      <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
        <h1 className="text-xl font-bold leading-tight text-primary md:text-2xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-card-text">{message}</p>

        <p className="text-sm text-card-text">
          <span className="font-bold">Total price:</span>{" "}
          {formatGbp(totalPrice)}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${buttonBase} bg-primary text-white hover:border-primary-dark hover:bg-primary-dark`}
          >
            See details
          </button>
          <button
            type="button"
            className={`${buttonBase} bg-transparent text-primary hover:bg-primary/5`}
          >
            Edit delivery
          </button>

          {freeGift && (
            <span
              data-testid="free-gift"
              className="-rotate-6 self-center rounded bg-secondary px-3.5 py-1.5 text-sm font-bold uppercase tracking-wider text-secondary-text shadow-md"
            >
              Free gift
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
