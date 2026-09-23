import { useEffect, useState } from 'react'
import { ApiError, fetchDelivery } from '../api/client'
import type { DeliveryResponse } from '../types/delivery'

export type DeliveryState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: DeliveryResponse; error: null }
  | { status: 'error'; data: null; error: ApiError }

function initialState(userId: string | undefined): DeliveryState {
  if (!userId) {
    return {
      status: 'error',
      data: null,
      error: new ApiError(400, 'No user id was provided.'),
    }
  }
  return { status: 'loading', data: null, error: null }
}

/**
 * Fetch the next delivery for a user, exposing an explicit state machine.
 * Refetches whenever `userId` changes and aborts in-flight requests on cleanup.
 */
export function useDelivery(userId: string | undefined): DeliveryState {
  const [state, setState] = useState<DeliveryState>(() => initialState(userId))
  const [trackedUserId, setTrackedUserId] = useState(userId)

  // Reset to the initial state during render when the user changes, so we never
  // show a stale card while the next request is in flight.
  if (userId !== trackedUserId) {
    setTrackedUserId(userId)
    setState(initialState(userId))
  }

  useEffect(() => {
    if (!userId) return

    const controller = new AbortController()

    fetchDelivery(userId, controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(0, 'Something went wrong. Please try again.')
        setState({ status: 'error', data: null, error: apiError })
      })

    return () => controller.abort()
  }, [userId])

  return state
}
