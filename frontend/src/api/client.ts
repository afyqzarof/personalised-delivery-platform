import type { DeliveryResponse } from '../types/delivery'

const DEFAULT_BASE_URL = 'http://localhost:3000'

/** Base URL for the backend, overridable via VITE_API_BASE_URL. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL

/**
 * Error thrown for non-2xx responses from the delivery API.
 * `status` is the HTTP status (0 when the request never reached the server).
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Fetch a user's next delivery. Throws ApiError on failure.
 */
export async function fetchDelivery(
  userId: string,
  signal?: AbortSignal,
): Promise<DeliveryResponse> {
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
