import { Cat } from '../users/user.types';
import {
  buildMessage,
  buildTitle,
  calcTotalPence,
  formatCatNames,
  isFreeGift,
  penceToPounds,
} from './comms.messaging';

function cat(overrides: Partial<Cat> = {}): Cat {
  return {
    name: 'Cat',
    subscriptionActive: true,
    breed: 'Thai',
    pouchSize: 'A',
    ...overrides,
  };
}

describe('formatCatNames', () => {
  it('returns an empty string for no cats', () => {
    expect(formatCatNames([])).toBe('');
  });

  it('returns the single name for one cat', () => {
    expect(formatCatNames(['Dorian'])).toBe('Dorian');
  });

  it('joins two names with "and"', () => {
    expect(formatCatNames(['Dorian', 'Ocie'])).toBe('Dorian and Ocie');
  });

  it('comma-separates three or more names with a final "and"', () => {
    expect(formatCatNames(['Dorian', 'Ocie', 'Eldridge'])).toBe(
      'Dorian, Ocie and Eldridge',
    );
    expect(formatCatNames(['A', 'B', 'C', 'D'])).toBe('A, B, C and D');
  });
});

describe('calcTotalPence', () => {
  it('is zero for no cats', () => {
    expect(calcTotalPence([])).toBe(0);
  });

  it('sums the pouch-size prices in pence', () => {
    // C (6275) + F (7125) = 13400, matching the README example.
    expect(
      calcTotalPence([cat({ pouchSize: 'C' }), cat({ pouchSize: 'F' })]),
    ).toBe(13400);
  });

  it('covers every pouch size', () => {
    expect(
      calcTotalPence([
        cat({ pouchSize: 'A' }),
        cat({ pouchSize: 'B' }),
        cat({ pouchSize: 'C' }),
        cat({ pouchSize: 'D' }),
        cat({ pouchSize: 'E' }),
        cat({ pouchSize: 'F' }),
      ]),
    ).toBe(5550 + 5950 + 6275 + 6600 + 6900 + 7125);
  });
});

describe('penceToPounds', () => {
  it('converts pence to pounds', () => {
    expect(penceToPounds(13400)).toBe(134);
    expect(penceToPounds(11500)).toBe(115);
  });
});

describe('isFreeGift', () => {
  it('is false at exactly the threshold (must exceed £120)', () => {
    expect(isFreeGift(120)).toBe(false);
  });

  it('is true above the threshold', () => {
    expect(isFreeGift(120.01)).toBe(true);
    expect(isFreeGift(134)).toBe(true);
  });

  it('is false below the threshold', () => {
    expect(isFreeGift(115)).toBe(false);
  });
});

describe('buildTitle', () => {
  it('embeds the formatted cat names', () => {
    expect(buildTitle('Dorian and Ocie')).toBe(
      'Your next delivery for Dorian and Ocie',
    );
  });
});

describe('buildMessage', () => {
  it('embeds the first name and formatted cat names', () => {
    expect(buildMessage('Kayleigh', 'Dorian and Ocie')).toBe(
      "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
    );
  });
});
