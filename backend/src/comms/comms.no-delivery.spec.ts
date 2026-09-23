import { User } from '../users/user.types';
import { UsersRepository } from '../users/users.repository';
import { CommsService } from './comms.service';

const NO_ACTIVE_CATS: User = {
  id: 'aaaaaaaa-0000-0000-0000-000000000000',
  firstName: 'Sam',
  lastName: 'Vega',
  email: 'sam@example.com',
  cats: [
    { name: 'Milo', subscriptionActive: false, breed: 'Thai', pouchSize: 'C' },
    {
      name: 'Nala',
      subscriptionActive: false,
      breed: 'Somali',
      pouchSize: 'F',
    },
  ],
};

function serviceWith(users: User[]): CommsService {
  const repository: UsersRepository = {
    findById: (id) => Promise.resolve(users.find((u) => u.id === id)),
  };
  return new CommsService(repository);
}

describe('CommsService — no active subscriptions', () => {
  it('returns coherent copy instead of "...for \'s fresh food."', async () => {
    const service = serviceWith([NO_ACTIVE_CATS]);

    const result = await service.getNextDelivery(NO_ACTIVE_CATS.id);

    expect(result.title).toBe('No delivery scheduled');
    expect(result.message).toContain('Hey Sam!');
    expect(result.message).not.toContain("'s fresh food");
    expect(result.totalPrice).toBe(0);
    expect(result.freeGift).toBe(false);
  });
});
