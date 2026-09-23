import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { ApiError } from '../api/errors'
import { fetchMockDelivery } from '../api/mockDelivery'
import type { DeliveryResponse } from '../types/delivery'

const DEFAULT_BASE_URL = 'http://localhost:3000'

/** Base URL for the backend, overridable via VITE_API_BASE_URL. */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL

/**
 * Hit the real backend by default. Set VITE_USE_MOCK_API=true to serve a
 * stubbed response instead (e.g. for offline UI work).
 */
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

/** Don't retry client errors (bad uuid / unknown user) — only transient ones. */
function shouldRetry(failureCount: number, error: ApiError): boolean {
  if (error.status === 400 || error.status === 404) return false
  return failureCount < 2
}

/**
 * Fetch the next delivery for a user. TanStack Query owns caching, dedup,
 * cancellation, retries and the loading/error/success state, so we return its
 * result directly.
 *
 * The queryFn throws ApiError on a non-2xx response — that throw is what
 * surfaces HTTP errors as the query's error state, since `fetch` itself
 * resolves (doesn't reject) on 4xx/5xx.
 */
export function useDelivery(
  userId: string | undefined,
): UseQueryResult<DeliveryResponse, ApiError> {
  return useQuery({
    queryKey: ['delivery', userId],
    queryFn: async ({ signal }): Promise<DeliveryResponse> => {
      const id = userId as string
      if (USE_MOCK_API) return fetchMockDelivery(id, signal)

      let response: Response
      try {
        response = await fetch(
          `${API_BASE_URL}/comms/your-next-delivery/${encodeURIComponent(id)}`,
          { signal, headers: { Accept: 'application/json' } },
        )
      } catch (cause) {
        // Network failure, CORS, DNS, etc. Re-throw aborts so TanStack ignores them.
        if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
        throw new ApiError(0, 'Unable to reach the server. Is the backend running?')
      }

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Request failed with status ${response.status}`,
        )
      }

      return (await response.json()) as DeliveryResponse
    },
    enabled: Boolean(userId),
    retry: shouldRetry,
  })
}
