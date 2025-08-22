import { Injectable, Logger } from '@nestjs/common';
import { TTemplateVarContext } from 'src/common/constants/template.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import Handlebars from 'handlebars';

@Injectable()
export class TemplateBuilderService {
  constructor(
    private prisma: PrismaService,
  ){}

  /**
   * Fetches and builds a template from the id and context.
   */
  async buildTemplate(templateStringId: number, context: TTemplateVarContext) 
    : Promise<{text: string, html: string}>{

    const templateString = await this.prisma.templates.findFirst({
      where:{
        id: Number(templateStringId)
      }
    })

    Logger.log(`Compiling Templates For Template ${templateStringId}`);

    try {
      const htmlTemplate = Handlebars.compile(templateString.templateHtmlString);
      const html =  htmlTemplate(context);
      Logger.log("Completed HTML Template Building")

      const plainTextTemplate = Handlebars.compile(templateString.templateString);
      const text = plainTextTemplate(context);
      Logger.log("Completed Text Template Building")

      return {
        text: text,
        html: html,
      }

    } catch(err) {
      Logger.error("Unable To Build Tempalte Contents for Event Action", err);
    }

    return null;
  }
}
