import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyService } from './survey.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('survey')
export class SurveyController {

  constructor(private surveyService: SurveyService){}

  /**
   * Endpoint to fetch the contents of a given token.
   */
  @Get('/:token')
  async getSurvey(@Param('token') token: string) {
    Logger.log("Awaiting Implementation")
  }

  /**
   * Endpoint to generate a new Survey Url Token.
   */
  @Post('/generate/:bookingDetails')
  async generateNewSurveyToken() {
    Logger.log("Awaiting Implementation")
  }


  /**
   * Endpoint to submit the responses to a survey
   */
  @Post('/submit/:token') 
  async submitResopnse(@Param('token') token : string, 
                       @Body() response: any) {
    Logger.log("Awaiting Implementation")
  }

  /**
   * Endpoint to view results from a survey
   */
  @Get('/bookingDetails/:confirmationNumber')
  @UseGuards(JwtAuthGuard)
  async viewSurveyResults(@Param('token') token: string) {
    Logger.log("Awaiting Implementation")
  }
}
