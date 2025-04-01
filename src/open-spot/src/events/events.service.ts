import { Injectable, Logger } from '@nestjs/common';
import { EventDetails } from './dtos/EventDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails, Business, BusinessPackage } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { text } from 'stream/consumers';
import { TemplateBuilderService } from 'src/template-builder/template-builder.service';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, 
              private emailService: EmailService,
              private templateBuildingService: TemplateBuilderService) {}

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
        duration_in_minutes: duration_in_minutes, 
        confirmationId: generatedConfimation, 
        personal_details: {...eventsDto.personalDetails}
      }
    })

    // Send Email To Business and User.
    this.sendEmails(bookingDetails, generatedConfimation)

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

  sendEmails = async (bookingDetails: BookingDetails, confirmationId: string): Promise<boolean> => {
    let sentPartnerEmail = false;
    let sentClientEmail = false;

    try {
      const business = await this.prisma.business.findFirst({
        where: {
          id: bookingDetails.business_id
        }
      })

      const businessPackage = await this.prisma.businessPackage.findFirst({
        where: {
          id: bookingDetails.package_id,
        }
      })

      sentPartnerEmail = await this.sendNewBookingRequestEmail(business, bookingDetails, businessPackage);
      sentClientEmail = await this.sendClientConfirmationEmail(business, bookingDetails, businessPackage, confirmationId);
    } catch {
      return false;
    }

    return sentPartnerEmail && sentClientEmail;
  }


  /**
   * Prepares and sends a business partner the new booking request details with all client information.
   */ 
  sendNewBookingRequestEmail = async (business: Business, bookingDetails: BookingDetails, businessPackage: BusinessPackage) : Promise<boolean> => {
    // To Email
    const contactDetails = business?.contact_info as {email: string, phone: string}
    const to = [`${business.business_UID} <${contactDetails.email}>`]
    
    // Subject of Email
    const subject = "A new booking request has come from OpenSpot!"
    
    // Build Template
    const htmlTemplate = await this.templateBuildingService.buildNewRequestTemplate(business, bookingDetails, businessPackage);

    // TODO CREATE TEXT VERSION OF TEMPLATE
    
    // Send Email
    return await this.emailService.sendEmailMessage(to, subject,"", htmlTemplate);
  }

  /**
   *  Prepares and sends a client the confirmation of their booking request.
   */ 
  sendClientConfirmationEmail = async (business: Business, bookingDetails: BookingDetails, businessPackage: BusinessPackage, confirmationId: string): 
    Promise<boolean> => {

    
    // To Email
    const contactDetails = bookingDetails?.personal_details as {
      firstName: string,
      lastName: string,
      email: string,
    }

    const to = [`${contactDetails.firstName} ${contactDetails.lastName} <${contactDetails.email}>`]
    
    // Subject of Email
    const subject = "Thank you for your Booking Request!"
    
    // Build Template
    const html = await this.templateBuildingService.buildNewBookingRequestEmail(business, bookingDetails, businessPackage, confirmationId);

    // TODO CREATE TEXT VERSION OF TEMPLATE

    // Send Email
    return await this.emailService.sendEmailMessage(to, subject, "" , html)
  }

}
