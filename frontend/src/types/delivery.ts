/**
 * Response contract for GET /comms/your-next-delivery/:userId.
 * This mirrors the frozen backend API.
 */
export interface DeliveryResponse {
  /** Card heading, e.g. "Your next delivery for Dorian and Ocie". */
  title: string
  /** Body copy shown under the title. */
  message: string
  /** Total price in pounds (e.g. 134 -> "£134.00"). */
  totalPrice: number
  /** When true, show the "FREE GIFT" sticker. */
  freeGift: boolean
}
