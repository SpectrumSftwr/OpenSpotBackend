import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';


@Controller('reviews')
export class ReviewsController {

  constructor(
    private reviewService: ReviewsService
  ){}

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
  async submitResopnse(@Body('token') token: string) {
    Logger.log("Awaiting Implementation")
  }

  /**
   * Endpoint to view results from a survey
   */
  @Get('/bookingDetails/:confirmationNumber')
  async viewSurveyResults(@Param('token') token: string) {
    Logger.log("Awaiting Implementation")
  }
}
