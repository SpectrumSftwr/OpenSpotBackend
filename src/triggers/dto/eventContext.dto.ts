import { Business } from "@prisma/client";

export class TemplateContext {

}

export class EventContext {
    type      :   string;
    belongsTo :   Business
    data      :   TemplateContext;
}
