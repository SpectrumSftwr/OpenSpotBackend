import { Controller, Get, Param } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private ProviderService: ProviderService){}

  @Get("/contact/:business_id")
  getProviderContactDetails(@Param('business_id') business_id: string) {
    return this.ProviderService.getProviderContactDetails(business_id);
  }
}
