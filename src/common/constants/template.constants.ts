import { Trigger } from "@prisma/client";

enum TemplateVarClass {
  BUSINESS,
  CLIENT,
  CLIENT_EVENT,
}

class TemplateVars {
  displayName: String;
  templateTag: String;
  class: TemplateVarClass;
}

/**
 * Template Context Object For Complete Template Processing.
 */
export class TTemplateVarContext {
    business: {
      name: string,
      name_UUID: string,
      type: string, 
      email: string,
      phoneNumber: string,
    }
    client: {
      firstName: string, 
      lastName: string, 
      phoneNumber: string, 
      email: string, 
      preferredContactMethod: string,
      event: {
        confirmationNumber: string,
        location: string,
        date: string,
        duration: string,
        eventType: string, 
        packageName: string, 
        packageInclusions: string,
        guestCount: string,
        comments: string,
        totalPrice: string,
        finalPaymentDueDate: string,
        reviewLink: string,
        surveyLink: string,
        eventRejectionReason: string,
      }
    }
    trigger: TriggerDetails | null
}

type TriggerDetails = {
  name: String, 
  sentAt: string
}

/**
 * ALL TEMPLATE STRINGS RELATED TO BUSINESS 
 */
const BUSINESS_NAME : TemplateVars = {
  displayName: "<Business Name>",
  templateTag: "{{business.name}}",
  class: TemplateVarClass.BUSINESS,

} 

const BUSINESS_TYPE : TemplateVars=  {
  displayName: "<Business Type>",
  templateTag: "{{business.type}}",
  class: TemplateVarClass.BUSINESS,
}

const BUSINESS_EMAIL: TemplateVars = {
  displayName: "<Business Phone Number>",
  templateTag :"{{business.email}}",
  class: TemplateVarClass.BUSINESS,
}
const BUSINESS_PHONE: TemplateVars = {
  displayName: "<Business Phone Number>",
  templateTag:"{{business.phone}}",
  class: TemplateVarClass.BUSINESS,
}  

/**
 * ALL TEMPLATE STRINGS RELATED TO CLIENT 
 */
const CLIENT_FIRST_NAME : TemplateVars = {
  displayName: "<Client First Name>",
  templateTag: "{{client.firstName}}",
  class: TemplateVarClass.CLIENT
} 
const CLIENT_LAST_NAME : TemplateVars = {
  displayName: "<Client Last Name>",
  templateTag: "{{client.lastName}}",
  class: TemplateVarClass.CLIENT
} 
const CLIENT_PHONE_NUMBER : TemplateVars = {
  displayName: "<Client Phone Number>",
  templateTag: "{{client.phoneNumber}}",
  class: TemplateVarClass.CLIENT
}
const CLIENT_EMAIL : TemplateVars = {
  displayName: "<Client Email>",
  templateTag: "{{client.email}}",
  class: TemplateVarClass.CLIENT
} 
const CLIENT_PREFFERED_METHOD_OF_CONTACT : TemplateVars = {
  displayName: "<Client Preffered Method of Contact>",
  templateTag: "{{client.preferredContactMethod}}",
  class: TemplateVarClass.CLIENT
} 

/**
 * ALL TEMPLATE STRINGS RELATED TO Client Events 
 */
const CLIENT_EVENT_LOCATION : TemplateVars = {
  displayName: "<Event Location>",
  templateTag: "{{client.event.location}}",
  class: TemplateVarClass.CLIENT_EVENT
} 
const CLIENT_EVENT_DATE : TemplateVars = {
  displayName: "<Event Date>",
  templateTag: "{{client.event.date}}",
  class: TemplateVarClass.CLIENT_EVENT
} 

const CLIENT_EVENT_DURATION: TemplateVars = {
  displayName: "<Event Duration>",
  templateTag: "{{client.event.duration}}",
  class: TemplateVarClass.CLIENT_EVENT,
} 

const CLIENT_EVENT_EVENT_TYPE : TemplateVars = {
  displayName: "<Event Type>",
  templateTag: "{{client.event.eventType}}",
  class: TemplateVarClass.CLIENT_EVENT
} 
const CLIENT_EVENT_GUEST_COUNT : TemplateVars = {
  displayName: "<Event Guest Count>",
  templateTag: "{{client.event.guestCount}}",
  class: TemplateVarClass.CLIENT_EVENT
} 

const CLIENT_EVENT_PACKAGE_NAME : TemplateVars = {
  displayName: "<Event Package Name>",
  templateTag: "{{client.event.packageName}}",
  class: TemplateVarClass.CLIENT_EVENT
} 
const CLIENT_EVENT_COMMENTS : TemplateVars = {
  displayName: "<Event Comments>",
  templateTag: "{{client.event.comments}}",
  class: TemplateVarClass.CLIENT_EVENT
} 


export const templateVariables : TemplateVars[] = [
  BUSINESS_NAME, 
  BUSINESS_TYPE, 
  BUSINESS_EMAIL, 
  BUSINESS_PHONE,
  CLIENT_FIRST_NAME,
  CLIENT_LAST_NAME,
  CLIENT_PHONE_NUMBER,
  CLIENT_EMAIL,
  CLIENT_PREFFERED_METHOD_OF_CONTACT,
  CLIENT_EVENT_LOCATION,
  CLIENT_EVENT_DATE,
  CLIENT_EVENT_EVENT_TYPE,
  CLIENT_EVENT_DURATION, 
  CLIENT_EVENT_GUEST_COUNT,
  CLIENT_EVENT_PACKAGE_NAME,
  CLIENT_EVENT_COMMENTS,

]
