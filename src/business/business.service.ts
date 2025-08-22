import { Injectable, Logger } from '@nestjs/common';
import { Business, User } from '@prisma/client';
import { error } from 'console';
import { request } from 'http';
import { catchError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BusinessService {

  constructor(
    private prisma: PrismaService,
  ){}

  /**
   * Method to check if a business Account UUID is already in use.
   * @param businessUUID - The business UUID being checked.
   * @returns true if no other accounts have the same businessUUID.
   */
  async isBusinessUUIDAvailable(businessUUID: string) {
    const result : number = await this.prisma.business.count({where: {
      business_UID: {
        equals: businessUUID,
        mode: "insensitive"
      }
    }})

    return result == 0
  }

  async createBusiness(businessRequestBody: any, userId: number) : Promise<Business> {
    if (!businessRequestBody || !userId) {
      Logger.error("Unable to create a business either request information not provided or User Id not given");
      throw error("Failed Business Creation");
    }

    Logger.log(`Creating a New Business Associated with User ${userId}`)

    const contactInfo = {
      phone: businessRequestBody.phone,
      email: businessRequestBody.email,
      state: businessRequestBody.state,
      city: businessRequestBody.city,
    }

    return await this.prisma.business.create({data: {
      business_UID: businessRequestBody.businessUsername,
      business_name: businessRequestBody.businessName,
      profileDescription: businessRequestBody.profileDescription, 
      profile_picture_url: '',
      business_banner_url: '',
      business_type: businessRequestBody.businessType,
      contact_info: contactInfo,
      // Created By
      user_id: userId,
    }})
  }

  async updateBusiness(businessId: number, field: string, newValue: any) {
    try {
      const updated = await this.prisma.business.update({
        where: { id: businessId }, // assumes your primary key field is "id"
        data: {
          [field]: newValue, // dynamic column update
        },
      });

      return updated;

    } catch (err) {
      Logger.error("Update failed:", err);
      throw err;
    }
  }

  async doesUserHaveBusiness(userId: number) :Promise<boolean> {
    let results = false
    try {
      const business = await this.prisma.business.findFirst({where: {
        user_id: {
          equals: userId
        }
      }})

      // IDK IF THIS IS GOOD
      results = business && true

    } catch (err) {
      Logger.log("Error Could not find Business With user ID" + userId)
    }

    return results;

  }

}
