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

  sendEmailMessage = async (to: string[], subject: string, text:string, html: string | null) : Promise<boolean> => {
    try {
      await this.mailgunClient.messages.create("sandboxc766a37a69514823bdc49f561154a502.mailgun.org", {
        from: "Mailgun Sandbox <postmaster@sandboxc766a37a69514823bdc49f561154a502.mailgun.org>",
        to: to,
        subject: subject,
        text: text,
        html: html 
      });

      return true;
    } catch (error) {
      Logger.error(error); //logs any error
      return false;
    }

    return;
  }
}
