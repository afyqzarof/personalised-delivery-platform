import type { DeliveryResponse } from '../types/delivery'
import { ApiError } from './errors'
import { fetchMockDelivery } from './mockDelivery'

export { ApiError }

const DEFAULT_BASE_URL = 'http://localhost:3000'

/** Base URL for the backend, overridable via VITE_API_BASE_URL. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL

/**
 * Until the backend is wired up we serve a stubbed response. Set
 * VITE_USE_MOCK_API=false to hit the real API instead.
 */
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

/**
 * Fetch a user's next delivery. Throws ApiError on failure.
 */
export async function fetchDelivery(
  userId: string,
  signal?: AbortSignal,
): Promise<DeliveryResponse> {
  if (USE_MOCK_API) {
    return fetchMockDelivery(userId, signal)
  }

  let response: Response
  try {
    response = await fetch(
      `${API_BASE_URL}/comms/your-next-delivery/${encodeURIComponent(userId)}`,
      { signal, headers: { Accept: 'application/json' } },
    )
  } catch (cause) {
    // Network failure, CORS, DNS, etc. Re-throw aborts so callers can ignore them.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(0, 'Unable to reach the server. Is the backend running?')
  }

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return (await response.json()) as DeliveryResponse
}
