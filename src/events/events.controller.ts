import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { RequestStatusEnum, User, Request as PrismaRequest } from '@prisma/client';
import { GetUserEventsDto } from './dtos/GetUserEventsDto.dto';
import { EventsStatisticsDto } from './dtos/EventsStatisticsDto.dto';

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService){}

  @Post('/create')
  async createNewEvent(@Body() eventDto: EventDetails) {
    return await this.eventsService.saveNewEvent(eventDto)
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

  /**
   * Responsible for getting counts and statistics based on event statuses
   * @returns a EventStatusDTO object.
   */
  @Get('/stats')
  @UseGuards(JwtAuthGuard)
  async getAllEventStatistics(@Req() req: Request) : Promise<EventsStatisticsDto>{
    return await this.eventsService.buildUserEventsStatistics(req.user as User);
  }

  @Get('/:confirmationId')
  async getEventDetails(@Param('confirmationId') confirmationId: string) {
    return await this.eventsService.getBookingDetails(confirmationId);
  }

  /**
   * Responsible for getting counts and statistics based on event statuses
   * @param reqBody {
   *    confirmationID: string REQUIRED,
   *    status: RequestStatusEnum REQUIRED,
   * }
   * @returns a EventStatusDTO object.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async updateEventStatus(@Body() reqBody: any) : Promise<PrismaRequest>{

    const confirmationID : string = reqBody.confirmationID;
    const status : RequestStatusEnum = reqBody.status;
    const requestNotes: string = reqBody.notes;
    const rejectionReason : string = reqBody.rejectionReason;
    const totalPrice : string = reqBody.totalPrice;
    const dueBy: string = reqBody.dueBy;

    return await this.eventsService.updateEventStatus(confirmationID, status, requestNotes, rejectionReason, totalPrice, dueBy);
  }

  @Post("/notes") 
  @UseGuards(JwtAuthGuard)
  async updateNotes(@Body() reqBody: any) {
    const confirmationID : string = reqBody.confirmationID;
    const requestNotes: string = reqBody.notes;
    const rejectionReason : string = reqBody.rejectionReason;

    await this.eventsService.updateNotes(confirmationID, requestNotes, rejectionReason);
  }
}
