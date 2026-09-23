import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../users/users.repository';
import { NextDeliveryDto } from './comms.dto';
import {
  buildMessage,
  buildTitle,
  calcTotalPence,
  formatCatNames,
  isFreeGift,
  penceToPounds,
} from './comms.messaging';

@Injectable()
export class CommsService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async getNextDelivery(userId: string): Promise<NextDeliveryDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const activeCats = user.cats.filter((cat) => cat.subscriptionActive);
    const catNames = formatCatNames(activeCats.map((cat) => cat.name));
    const totalPrice = penceToPounds(calcTotalPence(activeCats));

    return {
      title: buildTitle(catNames),
      message: buildMessage(user.firstName, catNames),
      totalPrice,
      freeGift: isFreeGift(totalPrice),
    };
  }
}
