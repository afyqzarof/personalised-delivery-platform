import { Cat } from '../users/user.types';
import {
  buildMessage,
  buildTitle,
  calcTotalPence,
  formatCatNames,
  isFreeGift,
  penceToPounds,
  POUCH_PRICE_PENCE,
} from './comms.messaging';

const cat = (name: string, pouchSize: Cat['pouchSize']): Cat => ({
  name,
  pouchSize,
  subscriptionActive: true,
  breed: 'Tabby',
});

describe('formatCatNames', () => {
  it('returns an empty string for no cats', () => {
    expect(formatCatNames([])).toBe('');
  });

  it('returns the single name for one cat', () => {
    expect(formatCatNames(['Betsy'])).toBe('Betsy');
  });

  it('joins two names with "and"', () => {
    expect(formatCatNames(['Betsy', 'Felix'])).toBe('Betsy and Felix');
  });

  it('comma-separates three or more names with a final "and"', () => {
    expect(formatCatNames(['Betsy', 'Felix', 'Heath'])).toBe(
      'Betsy, Felix and Heath',
    );
    expect(formatCatNames(['A', 'B', 'C', 'D'])).toBe('A, B, C and D');
  });
});

describe('calcTotalPence', () => {
  it('is 0 for no cats', () => {
    expect(calcTotalPence([])).toBe(0);
  });

  it('sums pouch prices as exact integer pence', () => {
    // 6900 (E) + 6600 (D) = 13500
    expect(calcTotalPence([cat('a', 'E'), cat('b', 'D')])).toBe(13500);
  });

  it('sums all pouch sizes without float drift', () => {
    const cats = (Object.keys(POUCH_PRICE_PENCE) as Cat['pouchSize'][]).map(
      (size) => cat(size, size),
    );
    expect(calcTotalPence(cats)).toBe(5550 + 5950 + 6275 + 6600 + 6900 + 7125);
  });
});

describe('penceToPounds', () => {
  it('converts pence to a pounds number', () => {
    expect(penceToPounds(13725)).toBe(137.25);
    expect(penceToPounds(12000)).toBe(120);
  });
});

describe('isFreeGift', () => {
  it('is false at exactly £120', () => {
    expect(isFreeGift(120)).toBe(false);
  });

  it('is true just above £120', () => {
    expect(isFreeGift(120.01)).toBe(true);
    expect(isFreeGift(137.25)).toBe(true);
  });

  it('is false below £120', () => {
    expect(isFreeGift(119.99)).toBe(false);
    expect(isFreeGift(0)).toBe(false);
  });
});

describe('buildTitle / buildMessage', () => {
  it('builds the title', () => {
    expect(buildTitle('Betsy and Felix')).toBe(
      'Your next delivery for Betsy and Felix',
    );
  });

  it('builds the message', () => {
    expect(buildMessage('Cordell', 'Betsy')).toBe(
      "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
    );
  });
});
