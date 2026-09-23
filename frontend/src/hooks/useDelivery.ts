import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { ApiError, fetchDelivery } from '../api/client'
import type { DeliveryResponse } from '../types/delivery'

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
 * `fetchDelivery` throws ApiError on a non-2xx response — that throw is what
 * surfaces HTTP errors as the query's error state, since `fetch` itself
 * resolves (doesn't reject) on 4xx/5xx.
 */
export function useDelivery(
  userId: string | undefined,
): UseQueryResult<DeliveryResponse, ApiError> {
  return useQuery({
    queryKey: ['delivery', userId],
    queryFn: ({ signal }) => fetchDelivery(userId as string, signal),
    enabled: Boolean(userId),
    retry: shouldRetry,
  })
}
