import { Cat, PouchSize } from '../users/user.types';
import { NextDeliveryDto } from './comms.dto';

// Pence (integers) so totals sum exactly and convert to pounds only once.
export const POUCH_PRICE_PENCE: Record<PouchSize, number> = {
  A: 5550,
  B: 5950,
  C: 6275,
  D: 6600,
  E: 6900,
  F: 7125,
};

export const FREE_GIFT_THRESHOLD_POUNDS = 120;

export function formatCatNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  const head = names.slice(0, -1);
  const tail = names[names.length - 1];
  return `${head.join(', ')} and ${tail}`;
}

export function calcTotalPence(cats: Cat[]): number {
  return cats.reduce(
    (total, cat) => total + POUCH_PRICE_PENCE[cat.pouchSize],
    0,
  );
}

export function penceToPounds(pence: number): number {
  return pence / 100;
}

export function isFreeGift(totalPricePounds: number): boolean {
  return totalPricePounds > FREE_GIFT_THRESHOLD_POUNDS;
}

export function buildTitle(catNames: string): string {
  return `Your next delivery for ${catNames}`;
}

export function buildMessage(firstName: string, catNames: string): string {
  return `Hey ${firstName}! In two days' time, we'll be charging you for your next order for ${catNames}'s fresh food.`;
}

/** Payload for a user whose cats all have inactive subscriptions. */
export function buildNoDelivery(firstName: string): NextDeliveryDto {
  return {
    title: 'No delivery scheduled',
    message: `Hey ${firstName}! You don't have any active subscriptions, so there's no delivery on the way. Reactivate a subscription to start loving fresh again.`,
    totalPrice: 0,
    freeGift: false,
  };
}
