import { Injectable, Logger } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails } from '@prisma/client';
import { EventBusService } from 'src/event-bus/event-bus.service';
import { EmittableType } from 'src/event-bus/dto/EmittableContext.dto';
import { EventContext } from 'src/triggers/dto/eventContext.dto';
import { TemplateContextService } from 'src/template-context/template-context.service';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, 
              private eventBusService : EventBusService,
              private templateContext : TemplateContextService,
  ) {}

  saveNewEvent = async (eventsDto: EventDetails) : Promise<{confirmation: string}|{hasError: boolean}> => {
    const generatedConfimation = this.generateConfirmation();

    let businessDetails = await this.prisma.business.findFirst({where: {
      business_UID: eventsDto.business_uid,
    }})

    if (businessDetails == null) {
      return {
        hasError: true
      };
    }

    const duration_in_minutes = this.getEventDuration(eventsDto);

    // Save event Details
    const bookingDetails = await this.prisma.bookingDetails.create({
      data: {
        business_id: businessDetails.id,
        event_date: eventsDto.eventDate,
        location: eventsDto.location,
        guest_count: eventsDto.guestCount,
        event_type: eventsDto.eventType,
        package_id: eventsDto.packageId,
        start_time: eventsDto.startTime,
        end_time: eventsDto.endTime,
        duration_in_minutes: duration_in_minutes, 
        confirmationId: generatedConfimation, 
        personal_details: {
          ...eventsDto.personalDetails
        }
      }
    })

    // Package the Event into a template object
    const eventContext : EventContext = {
      type: 'event.created',
      belongsTo: businessDetails,
      data: {
        ...await this.templateContext.buildContext(businessDetails, bookingDetails)
      },
    }

    // Send out the Messenger.
    this.eventBusService.emit(EmittableType.USER_CREATED_EVENT, eventContext)


    return {
      confirmation: generatedConfimation
    }
  }

  getEventDuration = (eventsDto: EventDetails) : number | undefined => {
      function parseTime(time: any) {
        let match = time.match(/(\d{1,2}):(\d{2})(AM|PM)/);
        if (!match) throw new Error("Invalid time format");
        
        let [_, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
      }

      let minutes1 = parseTime(eventsDto.startTime);
      let minutes2 = parseTime(eventsDto.endTime);

      return Math.abs(minutes1 - minutes2);
        

    }

  generateConfirmation = () : string => {
    const timestamp = Date.now().toString().slice(-8);
    const randomPart = Math.floor(10000 + Math.random() * 900000);
    return `${timestamp}-${randomPart}`
  }

  /**
   * Given a confirmation Id Will try and find the requested confirmation details.
   */
  getBookingDetails = async (confirmationId: string): Promise<BookingDetails> => {
    let bookingDetails = await this.prisma.bookingDetails.findFirst({where: {
      confirmationId: confirmationId
    }})

    if (!bookingDetails) {
      throw new Error("Invalid Confirmation Id");
    }

    Logger.log(`Booking details for: ${confirmationId} found`)

    return bookingDetails;
  }
}
