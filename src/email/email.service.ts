import { Injectable, Logger } from "@nestjs/common";
import Mailgun from "mailgun.js"
import * as formData from "form-data";

@Injectable()
export class EmailService {

  private mailgunClient : any; 

  constructor() {
    const mailgun = new Mailgun(formData);
    const API_KEY = process.env.MAILGUN_API_KEY || "";

    if (!API_KEY) {
      throw new Error("No API KEY Provided for Mailgun Client");
    }

    this.mailgunClient = mailgun.client({
      username: "api",
      key: API_KEY 
    })
  }

  sendEmailMessage = async (from: string, to: string, subject: string, text:string, html: string | null) : Promise<boolean> => {
    try {
      const request = {
        from: from,
        to: [to],
        subject: subject,
        text: text,
        html: html,
      }

      Logger.log("Workflow Enginee: Sending Email")
      await this.mailgunClient.messages.create("notifications.openspotapp.com", request);
      Logger.log(`Workflow Enginee: Email Sent to ${request.to}`)

      return true;

    } catch (error) {
      Logger.error("[EmailService] Something Went Wrong while sending the email:"); //logs any error
      Logger.error(error); //logs any error

      return false;
    }
  }
}
