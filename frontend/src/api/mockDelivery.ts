import type { DeliveryResponse } from '../types/delivery'
import { ApiError } from './errors'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** The all-zero uuid maps to a 404 so the not-found UI is easy to preview. */
const NOT_FOUND_ID = '00000000-0000-0000-0000-000000000000'

/** Resolve after `ms`, rejecting with an AbortError if the signal aborts. */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const id = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

/**
 * Stubbed delivery response used until the backend is available. Mirrors the
 * real API contract, including its error cases:
 *  - malformed uuid  -> 400
 *  - the all-zero uuid -> 404 (handy for exercising the not-found UI)
 */
export async function fetchMockDelivery(
  userId: string,
  signal?: AbortSignal,
): Promise<DeliveryResponse> {
  await delay(400, signal)

  if (!UUID_RE.test(userId)) {
    throw new ApiError(400, 'Invalid user id.')
  }
  if (userId === NOT_FOUND_ID) {
    throw new ApiError(404, 'Unknown user.')
  }

  return {
    title: 'Your next delivery for Dorian and Ocie',
    message:
      "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
    totalPrice: 134,
    freeGift: true,
  }
}
