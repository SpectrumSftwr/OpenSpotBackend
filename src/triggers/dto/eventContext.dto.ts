import { Business } from "@prisma/client";
import { TTemplateVarContext } from "src/common/constants/template.constants";


export class EventContext {
    type      :   string;
    belongsTo :   Business
    data      :   TTemplateVarContext;
}
