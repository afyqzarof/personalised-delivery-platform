/**
 * Format a price given in pounds as a GBP string, e.g. 134 -> "£134.00".
 */
export function formatGbp(pounds: number): string {
  return `£${pounds.toFixed(2)}`
}
