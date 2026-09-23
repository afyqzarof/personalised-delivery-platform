import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NextDeliveryDto } from './comms.dto';
import { CommsService } from './comms.service';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('your-next-delivery/:userId')
  getNextDelivery(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<NextDeliveryDto> {
    return this.commsService.getNextDelivery(userId);
  }
}
