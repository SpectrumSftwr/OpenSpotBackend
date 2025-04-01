import { Injectable, Logger } from '@nestjs/common';
import { BookingDetails, Business, BusinessPackage } from '@prisma/client';
import { promises as fs } from 'fs'
import * as Mustache from 'mustache'
import * as path from 'path'

@Injectable()
export class TemplateBuilderService {

  private templatesDirectory = path.join(__dirname, '../../templates')

  async loadTemplate(fileName: string) : Promise<string> {

    try {
      const filePath = path.join(this.templatesDirectory, fileName);
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      Logger.error("Error Loading the templates:", error)
      return null;
    }
  }

  async buildNewRequestTemplate(business: Business, bookingDetails: BookingDetails, requestPackage: BusinessPackage) : Promise<string> {
    const template = await this.loadTemplate('new_booking_request.html');
    const clientDetails = bookingDetails.personal_details as {
      firstName: string,
      lastName: string,
      email: string,
      phone: string,
      comments: string,
    };

    const data = {
      client_name: `${clientDetails.firstName} ${clientDetails.lastName}`,
      provider_name: business.business_name,
      event_type: bookingDetails.event_type,
      event_date: bookingDetails.event_date.toDateString(),
      event_duration: bookingDetails.duration_in_minutes ,
      event_venue: bookingDetails.location,
      guest_count: bookingDetails.guest_count,
      client_phone: clientDetails.phone,
      client_email: clientDetails.email,
      client_notes: clientDetails.comments,
      your_name: "Juan Mejia",
      your_business_name: "OpenSpot",
      your_contact_email: "Jmejia@OpenSpot.com",
      package: requestPackage.title
    };

    const htmlOutput = Mustache.render(template, data);

    return htmlOutput;
  }

  async buildNewBookingRequestEmail(business: Business, bookingDetails: BookingDetails, requestPackage: BusinessPackage, confirmation_number: string) 
    : Promise<string> {
    const template = await this.loadTemplate('request_confirmation.html');

    const clientDetails = bookingDetails.personal_details as {
      firstName: string,
    };

    const openspot_contact_info = business.contact_info as {

    }

    const data = {
      confirmation_number: confirmation_number,
      client_name: clientDetails.firstName ,
      event_date: bookingDetails.event_date.toDateString(),
      event_type: bookingDetails.event_type,
      provider_name: business.business_name,
      openspot_contact_info: "help@OpenSpot.com",
      your_full_name: "Juan Mejia",
      your_title: "OpenSpot Founder",
      email_address: "Jmejia@OpenSpot.com",
      website_url: "https://OpenSpot.com"
    }

    const htmlOutput = Mustache.render(template, data);

    return htmlOutput;
  }
}
