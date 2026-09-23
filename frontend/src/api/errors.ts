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
