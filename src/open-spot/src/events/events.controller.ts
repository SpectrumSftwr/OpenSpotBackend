import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService){}

  @Post('/create')
  createNewEvent(@Body() eventDto: EventDetails) {
    return this.eventsService.saveNewEvent(eventDto)
  }

  @Get('/:confirmationId')
  getEventDetails(@Param('confirmationId') confirmationId: string) {
    return this.eventsService.getBookingDetails(confirmationId);
  }
}
