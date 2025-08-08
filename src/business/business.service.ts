import { Injectable } from '@nestjs/common';
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
      business_UID: businessUUID
    }})

    return result == 0
  }
}
