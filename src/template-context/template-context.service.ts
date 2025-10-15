import { Injectable, Logger } from '@nestjs/common';
import { BookingDetails, Business, PackageItemOnPackage } from '@prisma/client';
import { request } from 'http';
import { TTemplateVarContext } from 'src/common/constants/template.constants';
import { PersonalDetailsContextDto } from 'src/events/dtos/EventDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactDetailsDto } from 'src/provider/dto/ContactDetails.dto';

@Injectable()
export class TemplateContextService {

  constructor(
    private prisma: PrismaService,
  ){}

  async buildContext(business : Business, bookingDetails: BookingDetails) : Promise<TTemplateVarContext> {
    const businessContactInfo = business.contact_info as any as ContactDetailsDto;
    const clientContactDetails = bookingDetails.personal_details as any as PersonalDetailsContextDto;
    const bookingPackage = await this.prisma.businessPackage.findFirst({where:{
      id: bookingDetails.package_id
    }})

    const bookingNotes = await this.prisma.eventNotes.findFirst({
      where: {
        booking_id: bookingDetails.id
      } 
    })

    const inclusions : PackageItemOnPackage[] = await this.prisma.packageItemOnPackage.findMany({
      where: {
        packageId : bookingPackage.id
      }
    })

    const inclusionsString = await this.convertInclusionIdsIntoPackageItems(inclusions);

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
              date: bookingDetails.event_date.toLocaleDateString(
                "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }
              ),
              eventType: bookingDetails.event_type,
              duration: bookingDetails.duration_in_minutes.toString(),
              guestCount: bookingDetails.guest_count.toString(),
              comments: clientContactDetails.comments,
              packageName: bookingPackage.title,
              packageInclusions: inclusionsString,
              totalPrice: bookingDetails.totalEventPrice ? bookingDetails.totalEventPrice.toFixed(2).toString() : "0.00",
              finalPaymentDueDate: bookingDetails.dueBy ? bookingDetails.dueBy.toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
              }) : "Unknown",
              //
              // TODO: REVIEW AND SURVEY LINKS.
              reviewLink: "TBD",
              surveyLink: "TBD",
              eventRejectionReason: bookingNotes ? bookingNotes.rejectionNotes : ""
            }
          },
          trigger: null,

      }

      return templateContextObject;

    } catch (err) {

      Logger.error("[TemplateContextService] Unable to create Event Context: ",  err);
      return null;
    }
  }

  async convertInclusionIdsIntoPackageItems(inclusions: PackageItemOnPackage[]) : Promise<string> {
    let results = "";
    for (let inclusion of inclusions) {
      let currentInclusion = await this.prisma.businessPackageItem.findFirst({
        where: {
          id: inclusion.packageItemId
        }
      })

      if (!currentInclusion)  {
        Logger.warn("Inclusion Item Not Found: {}", inclusion.packageItemId);
        continue;
      }

      // If first result
      if (!results) {
        results = currentInclusion.name;
      } else {
        results = results + " | " + currentInclusion.name
      }
    }

    return results;
  }

}
