import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { EventsService } from './events.service';
import { Record } from '@prisma/client/runtime/library';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { query, Request } from 'express';
import { User } from '@prisma/client';
import { GetUserEventsDto } from './dtos/GetUserEventsDto.dto';

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService){}

  @Post('/create')
  async createNewEvent(@Body() eventDto: EventDetails) {
    return await this.eventsService.saveNewEvent(eventDto)
  }

  @Get('/:confirmationId')
  async getEventDetails(@Param('confirmationId') confirmationId: string) {
    return await this.eventsService.getBookingDetails(confirmationId);
  }

  /**
   * This Endpoint will be responsible for fetching all events that will be displayed by the
   * events dashboard. 
   *
   * @param query - Query Parameters that will be used for Filtering & Sorting.
   * @returns a list of events that meet the criterias.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllEventsWithFilter(@Query() query: GetUserEventsDto, @Req() req: Request) {
    return await this.eventsService.findAllEventsWithFilter(req.user as User, query);
  }
}
