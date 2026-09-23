import { useQuery } from '@tanstack/react-query'
import { ApiError, fetchDelivery } from '../api/client'
import type { DeliveryResponse } from '../types/delivery'

export type DeliveryState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: DeliveryResponse; error: null }
  | { status: 'error'; data: null; error: ApiError }

/** Don't retry client errors (bad uuid / unknown user) — only transient ones. */
function shouldRetry(failureCount: number, error: ApiError): boolean {
  if (error.status === 400 || error.status === 404) return false
  return failureCount < 2
}

/**
 * Fetch the next delivery for a user via TanStack Query, normalised into an
 * explicit state machine. Caching, request dedup, cancellation and retries are
 * handled by the query client; a missing userId maps to a 400 error state.
 */
export function useDelivery(userId: string | undefined): DeliveryState {
  const query = useQuery<DeliveryResponse, ApiError>({
    queryKey: ['delivery', userId],
    queryFn: ({ signal }) => fetchDelivery(userId as string, signal),
    enabled: Boolean(userId),
    retry: shouldRetry,
  })

  if (!userId) {
    return {
      status: 'error',
      data: null,
      error: new ApiError(400, 'No user id was provided.'),
    }
  }

  if (query.status === 'success') {
    return { status: 'success', data: query.data, error: null }
  }

  if (query.status === 'error') {
    return { status: 'error', data: null, error: query.error }
  }

  return { status: 'loading', data: null, error: null }
}
