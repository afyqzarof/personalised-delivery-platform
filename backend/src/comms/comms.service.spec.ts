import { NotFoundException } from '@nestjs/common';
import { User } from '../users/user.types';
import { UsersRepository } from '../users/users.repository';
import { CommsService } from './comms.service';

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '618f4ed6-1c5b-4993-a149-f64700bf31dd',
  firstName: 'Cordell',
  lastName: 'Koepp-Torphy',
  email: 'cordell@example.com',
  cats: [],
  ...overrides,
});

const stubRepo = (user?: User): UsersRepository => ({
  findById: async (id: string) => (user && user.id === id ? user : undefined),
});

describe('CommsService', () => {
  it('builds the delivery payload for active cats only', async () => {
    const user = makeUser({
      firstName: 'Pete',
      cats: [
        {
          name: 'Milo',
          subscriptionActive: true,
          breed: 'Bengal',
          pouchSize: 'D',
        },
        {
          name: 'Otis',
          subscriptionActive: true,
          breed: 'Ragdoll',
          pouchSize: 'F',
        },
        {
          name: 'Ghost',
          subscriptionActive: false,
          breed: 'Sphynx',
          pouchSize: 'F',
        },
      ],
    });
    const service = new CommsService(stubRepo(user));

    const result = await service.getNextDelivery(user.id);

    expect(result).toEqual({
      title: 'Your next delivery for Milo and Otis',
      message:
        "Hey Pete! In two days' time, we'll be charging you for your next order for Milo and Otis's fresh food.",
      totalPrice: 137.25, // D (66.00) + F (71.25)
      freeGift: true,
    });
  });

  it('has no free gift when the total is at or below £120', async () => {
    const user = makeUser({
      cats: [
        {
          name: 'Betsy',
          subscriptionActive: true,
          breed: 'Savannah',
          pouchSize: 'E',
        },
      ],
    });
    const service = new CommsService(stubRepo(user));

    const result = await service.getNextDelivery(user.id);

    expect(result.totalPrice).toBe(69);
    expect(result.freeGift).toBe(false);
  });

  it('ignores inactive cats entirely (all inactive -> empty names, £0)', async () => {
    const user = makeUser({
      firstName: 'Sam',
      cats: [
        {
          name: 'Betsy',
          subscriptionActive: false,
          breed: 'Savannah',
          pouchSize: 'E',
        },
        {
          name: 'Felix',
          subscriptionActive: false,
          breed: 'Siamese',
          pouchSize: 'F',
        },
      ],
    });
    const service = new CommsService(stubRepo(user));

    const result = await service.getNextDelivery(user.id);

    expect(result).toEqual({
      title: 'Your next delivery for ',
      message:
        "Hey Sam! In two days' time, we'll be charging you for your next order for 's fresh food.",
      totalPrice: 0,
      freeGift: false,
    });
  });

  it('throws NotFoundException for an unknown user', async () => {
    const service = new CommsService(stubRepo());

    await expect(
      service.getNextDelivery('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(NotFoundException);
  });
});
