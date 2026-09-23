/**
 * Response contract for GET /comms/your-next-delivery/:userId.
 * This mirrors the frozen backend API.
 */
export interface DeliveryResponse {
  title: string
  message: string
  /** Total price in pounds (e.g. 134 -> "£134.00"), not pence. */
  totalPrice: number
  freeGift: boolean
}
