import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProviderService {
  constructor(private prisma: PrismaService) {}

  getProviderContactDetails = async (business_id: string): Promise<any> => {
    let providerDetails = await this.prisma.business.findFirst({where: {
      id: parseInt(business_id)
    }})

    if (!providerDetails) {
      throw new Error("No Provider Details Found for Id: " + business_id)
    }

    return providerDetails.contact_info;
  }
}
