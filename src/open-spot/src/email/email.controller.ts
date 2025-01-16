import { Controller, Get, Param } from "@nestjs/common";

@Controller('mail')
export class EmailController {
  constructor(private emailService: EmailService){}

  @Get('/:email')
  async addToMailingList(@Param('email') email: string) {
    // Verify That this is a "valid" email
    
    // Add To List
    
    // Send Welcome Email.
    
  }
}
