import { Injectable, Logger } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails, Business, User, Request, RequestStatusEnum } from '@prisma/client';
import { EventBusService } from 'src/event-bus/event-bus.service';
import { EmittableType } from 'src/event-bus/dto/EmittableContext.dto';
import { EventContext } from 'src/triggers/dto/eventContext.dto';
import { TemplateContextService } from 'src/template-context/template-context.service';
import { BusinessService } from 'src/business/business.service';
import { GetUserEventsDto } from './dtos/GetUserEventsDto.dto';
import { EventsStatisticsDto } from './dtos/EventsStatisticsDto.dto';
import { UserEventTypes } from 'src/common/types/AutomationEventTypes';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, 
              private eventBusService : EventBusService,
              private templateContext : TemplateContextService,
              private businessService: BusinessService,
  ) {}

  saveNewEvent = async (eventsDto: EventDetails) : Promise<{confirmation: string}|{hasError: boolean}> => {
    const generatedConfimation = this.generateConfirmation();

    let businessDetails : Business = await this.prisma.business.findFirst({where: {
      business_UID: {
        equals: eventsDto.business_uid,
        mode: "insensitive"
      }
    }})

    if (businessDetails == null) {
      Logger.error(`No Business Details Where found for the event dto: ${eventsDto.business_uid}`)
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
        },
        optionalAddOns: {
          connect: eventsDto.addOns.map((id) => ({id})),
        }
      }
    })

    await this.prisma.request.create({
      data: {
        confirmationId: generatedConfimation,
        business_id: businessDetails.id,
        booking_id: bookingDetails.id,
        status: "PENDING"
      }
    })

    // Package the Event into a template object
    const eventContext : EventContext = {
      type: UserEventTypes.CREATED,
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

  /**
   * Finds all Events that fit a given Filter Dto.
   * @param user - The user who is making the request.
   * @param query - The query parameters.
   */
  async findAllEventsWithFilter(user: User, query: GetUserEventsDto) {
    const { page, pageSize, sort, status } = query;

    // Pagination Math
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    // Sorting 
    let orderBy : any = { event_date: 'desc' }

    if (sort) {
      const [field, direction] = sort.split(',')
      orderBy = {[field]: direction.toLowerCase() === 'asc' ? 'asc': 'desc'}
    }


   const business = await this.businessService.findBusinessByUserId(user.id)
   const businessID =  business.id

   const where : any = { 
     business_id : businessID,
   };

   if (status) {
     where.request = { status };
   }
    
    const [items, total]= await Promise.all([
      this.prisma.bookingDetails.findMany({
        where, 
        skip: skip, 
        take, 
        orderBy,
        include: {
          request: true,
          eventNotes: true,
        }
      }) ,
      this.prisma.bookingDetails.count({where}),
    ])
    
    return {
      data: items, 
      meta: {
        page, 
        pageSize,
        total,
        totalPages: Math.ceil(total/pageSize)
      }
    }
  }

  /**
   * Method to build user events statistics;
   */
  async buildUserEventsStatistics(user: User) : Promise<EventsStatisticsDto>{
    if (!user) {
      throw Error("Unable to build Events Statistics no User given");
    }

   const business = await this.businessService.findBusinessByUserId(user.id)

   // Query for accepted all time.
   const upcomingAcceptedQuery = {
        business_id: business.id,
        event_date: {
          gte: new Date(),
        },
        request: {
          status: {
            in: ["APPROVED"] 
          }
        }
   }
   
   // Query for pending in the future;
   const pendingQuery = {
        business_id: business.id,
        request: {
          status: {
            in: ["PENDING"] 
          }
        }
   }

   const startOfToday = new Date();
   startOfToday.setHours(0,0,0,0);
   const oneMonthToDate = new Date(startOfToday);
   oneMonthToDate.setMonth(oneMonthToDate.getMonth() + 1);
   const upcomingThisMonthQuery = {
        business_id: business.id,
        event_date: {
          gte: startOfToday,
          lt: oneMonthToDate,
        },
        request: {
          status: {
            in: ["PENDING", "APPROVED"] 
          }
        }
   }

   const yearToDateQuery = {
        business_id: business.id,
        event_date: {
          gte: new Date(startOfToday.getFullYear(), 0, 1),
          lt: startOfToday,
        },
        request: {
          status: {
            in: ["PENDING", "APPROVED", "PAID"] 
          }
        }
   }

   // find all request based on different criteria.
   const [upcomingAccepted, pending, upcomingThisMonth, yearToDate] = await Promise.all([
     this.countEventsByGivenWhereClause({ where: {...upcomingAcceptedQuery }}),
     this.countEventsByGivenWhereClause({ where: {...pendingQuery }}),
     this.countEventsByGivenWhereClause({ where: {...upcomingThisMonthQuery }}),
     this.countEventsByGivenWhereClause({ where: {...yearToDateQuery}}),
   ])

   return {
     upcomingAccepted,
     pending,
     upcomingThisMonth, 
     yearToDate,
   }
  }

  /**
   * Helper method to count the booking details based on a passed where clause.
   */
  private async countEventsByGivenWhereClause(where: any) : Promise<number>{
    if (!where) {
      throw Error("Unable to create events statistics query");
    }

    return await this.prisma.bookingDetails.count({...where})
  }

  /**
   * Method to update event status. 
   */
  async updateEventStatus(confirmationID: string, 
                          status: RequestStatusEnum, 
                          notes: string,
                          rejectionNotes: string,
                          totalPrice: string,
                          dueBy: string
                         ) : Promise<Request>{
    
    // get the booking. 
    const requestToUpdate = await this.prisma.request.findFirst({
      where: {
        booking: {
          confirmationId: confirmationID
        }
      }
    })

    // update the request.
    let updatedRequest : Request = null;
    if (requestToUpdate) {
      if (requestToUpdate.status == "APPROVED" || requestToUpdate.status == "REJECTED") {
        throw Error("Event Already Approved Cannot Change Status.");
      }

      updatedRequest = await this.prisma.request.update({
        where: {
           id: requestToUpdate.id
        },
        data: {
          status: status,
        }
      })

      this.updateNotes(confirmationID, notes, rejectionNotes);

    }

    // If event was Approved set the price and due date.
    if (updatedRequest.status === "APPROVED" && totalPrice && dueBy) {
      await this.prisma.bookingDetails.update({
        where: {
          confirmationId: confirmationID
        },
        data: {
          totalEventPrice: Number(totalPrice),
          dueBy: new Date(dueBy),
        }
      })

      Logger.log("Successfully Added a Event Price and dueBy date.")
    }

    Logger.warn("Successfully Updated the Status of the given event");

    this.runAutomationOnEventUpdate(updatedRequest);


    return updatedRequest;
  }


  /**
   * Helper method to count the booking details based on a passed where clause.
   */
  async updateNotes(confirmationID: string, 
                    notes: string,
                    rejectionNotes: string) : Promise<void> {
    const booking = await this.prisma.bookingDetails.findFirst({
      where: {
        confirmationId: confirmationID,
      }
    })

    const eventNotes = await this.prisma.eventNotes.findFirst({
      where: {
        booking_id: booking.id
      }
    })

    if (!eventNotes) {
      await this.prisma.eventNotes.create({
        data: {
          booking_id: booking.id,
          rejectionNotes: rejectionNotes,
          notes: notes
        } 
      })

    } else {

      await this.prisma.eventNotes.update({
        where: {
          booking_id: booking.id,
        },
        data: {
          rejectionNotes: rejectionNotes ? rejectionNotes : eventNotes.rejectionNotes,
          notes : notes ? notes : eventNotes.notes,
        }
      })
    }
  }

  /**
   * Helper Method to run Automations for Event Status Updates.
   */
  async runAutomationOnEventUpdate(updatedRequest: Request) {
    const business_id = updatedRequest.business_id;
    const booking_id = updatedRequest.booking_id;

    const businessDetails = await this.prisma.business.findFirst({where: {id: business_id}})
    const bookingDetails = await this.prisma.bookingDetails.findFirst({where: {id: booking_id}})
    
    // Send Out Trigger For Anyone Listening in on Status Changes
    if(updatedRequest) {
      // Package the Event into a template object
      const eventContext : EventContext = {
        type: 'event',
        belongsTo: businessDetails,
        data: {
          ...await this.templateContext.buildContext(businessDetails, bookingDetails)
        },
      }

      let type = "event";

      if (updatedRequest.status == "APPROVED") {
        type = UserEventTypes.APPROVED;
      }
      else if (updatedRequest.status == "REJECTED") {
        type = UserEventTypes.REJECTED;
      }
      else if (updatedRequest.status == "PAID") {
        type = UserEventTypes.PAID;
      }
      else if (updatedRequest.status == "COMPLETED") {
        type = UserEventTypes.COMPLETED;
      }

      eventContext.type = type;
      Logger.log("Emitting The Following Event Bus Context");
      Logger.log(eventContext);

      this.eventBusService.emit(EmittableType.USER_CREATED_EVENT, eventContext)
    }
  }

  async getPackageAndAddOnsForBooking(bookingId: string) : Promise<any> {
    const bookingDetails = await this.prisma.bookingDetails.findFirst({
      where: {
        confirmationId: {
          equals: bookingId,
          mode: 'insensitive'
        }
      },
      include: {
        package: {
          include: {
            packageFeatures: true
          }
        },
        optionalAddOns: true
      }
    })

    const packageInclusions = await this.prisma.businessPackageItem.findMany({
      where: {
        id: {
          in: bookingDetails.package.packageFeatures.map((feature) => feature.packageItemId)
        }
      }
    })

    bookingDetails.package['inclusions'] = packageInclusions;

    return {
      package: bookingDetails.package,
      optionalAddOns: bookingDetails.optionalAddOns,
    }
  }

  async createNewEventReview(business_UID: string, from: string, rating: number, comment: string, event_date: string ) {

    const business = await this.prisma.business.findFirst({
      where: {
        business_UID: {
          equals: business_UID,
          mode: 'insensitive',
        }
      }
    })

    Logger.log(`[Events.service] Creating a new Review for ${business.business_UID}`)

    const review = await this.prisma.businessReviews.create({
      data: {
        business_id: business.id,
        from: from,
        rating: rating,
        comment: comment,
        event_date: new Date(event_date)
      }
    })

    if (!review) {
      Logger.error("Something went wrong when creating the new Review");
      throw new Error("Unable to create the Review");
    }

    return review;
  }
}
