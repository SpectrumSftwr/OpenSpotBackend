import { Injectable, Logger } from '@nestjs/common';
import { BookingDetails, Business } from '@prisma/client';
import { TTemplateVarContext } from 'src/common/constants/template.constants';
import { PersonalDetailsContextDto } from 'src/events/dtos/EventDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactDetailsDto } from 'src/provider/dto/ContactDetails.dto';

@Injectable()
export class TemplateContextService {

  constructor(
    private prisma: PrismaService,
  ){}

  async buildContextFromEventConfirmation(business : Business, confirmationString: string) : Promise<TTemplateVarContext> {
    const bookingDetails = await this.prisma.bookingDetails.findFirst({})
    return this.buildContext(business, bookingDetails);
  }

  async buildContext(business : Business, bookingDetails: BookingDetails) : Promise<TTemplateVarContext> {
    const businessContactInfo = business.contact_info as any as ContactDetailsDto;
    const clientContactDetails = bookingDetails.personal_details as any as PersonalDetailsContextDto;
    const bookingPackage = await this.prisma.businessPackage.findFirst({where:{
      id: bookingDetails.package_id
    }})

    try {
      const templateContextObject : TTemplateVarContext = {
          business: {
            name: business.business_name,
            name_UUID: business.business_UID,
            type: business.business_type,
            email: businessContactInfo.email,
            phoneNumber: businessContactInfo.phone.toString(),
          },

          client: {
            firstName: clientContactDetails.firstName,
            lastName: clientContactDetails.lastName,
            phoneNumber: clientContactDetails.phone,
            email: clientContactDetails.email,
            preferredContactMethod: clientContactDetails.preferredContact,
            event: {
              confirmationNumber: bookingDetails.confirmationId,
              location: bookingDetails.location,
              date: bookingDetails.event_date.toISOString(),
              eventType: bookingDetails.event_type,
              duration: bookingDetails.duration_in_minutes.toString(),
              guestCount: bookingDetails.guest_count.toString(),
              comments: clientContactDetails.comments,
              packageName: bookingPackage.title

            }
          }
      }

      return templateContextObject;

    } catch (err) {
      Logger.error("[TemplateContextService] Unable to create Event Context: ",  err);
      return null;
    }
  }

}
