import { NotFoundException } from '@nestjs/common';
import { User } from '../users/user.types';
import { UsersRepository } from '../users/users.repository';
import { CommsService } from './comms.service';

const KAYLEIGH: User = {
  id: 'ff535484-6880-4653-b06e-89983ecf4ed5',
  firstName: 'Kayleigh',
  lastName: 'Wilderman',
  email: 'Kayleigh_Wilderman@hotmail.com',
  cats: [
    { name: 'Dorian', subscriptionActive: true, breed: 'Thai', pouchSize: 'C' },
    { name: 'Ocie', subscriptionActive: true, breed: 'Somali', pouchSize: 'F' },
    {
      name: 'Eldridge',
      subscriptionActive: false,
      breed: 'Himalayan',
      pouchSize: 'A',
    },
  ],
};

function serviceWith(users: User[]): CommsService {
  const repository: UsersRepository = {
    findById: (id) => Promise.resolve(users.find((u) => u.id === id)),
  };
  return new CommsService(repository);
}

describe('CommsService', () => {
  it('builds the delivery payload from the README example', async () => {
    const service = serviceWith([KAYLEIGH]);

    await expect(service.getNextDelivery(KAYLEIGH.id)).resolves.toEqual({
      title: 'Your next delivery for Dorian and Ocie',
      message:
        "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
      totalPrice: 134,
      freeGift: true,
    });
  });

  it('excludes inactive cats from names and price', async () => {
    const service = serviceWith([
      {
        ...KAYLEIGH,
        cats: [
          { ...KAYLEIGH.cats[0], subscriptionActive: true, pouchSize: 'A' },
          { ...KAYLEIGH.cats[1], subscriptionActive: false, pouchSize: 'F' },
        ],
      },
    ]);

    const result = await service.getNextDelivery(KAYLEIGH.id);
    expect(result.title).toBe('Your next delivery for Dorian');
    expect(result.totalPrice).toBe(55.5);
    expect(result.freeGift).toBe(false);
  });

  it('throws NotFound for an unknown user', async () => {
    const service = serviceWith([]);

    await expect(service.getNextDelivery('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
