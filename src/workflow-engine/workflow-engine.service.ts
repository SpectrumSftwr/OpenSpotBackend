import { Injectable, Logger } from '@nestjs/common';
import { Workflow } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { TemplateBuilderService } from 'src/template-builder/template-builder.service';
import { WorkflowAction, WorkflowStep } from 'src/workflows/dto/workflowstep.dto';
import Handlebars from 'handlebars';
import { EventContext } from 'src/triggers/dto/eventContext.dto';

@Injectable()
export class WorkflowEngineService {

  constructor(
    private emailService: EmailService,
    private templateService : TemplateBuilderService
  ){}

  async runWorkflow(workflow: Workflow, context: EventContext) {
    // get all the steps of the workflow 
    try {
      const steps: WorkflowStep[] = workflow.steps as any as WorkflowStep[]; 

      // Run each step in the workflow as an individual step.
      for (const step of steps) {
        const renderedStep: WorkflowStep = this.render(step, context);
        this.runStep(renderedStep, context);
      }
    } catch (err) {
      Logger.error("Workflow Engine unable to run steps: ", err)
    }
  }

  /**
   * This method is how the workflow steps are rendered with proper attributes.  
   * A separate method will be used in the template service to build the 
   * Email/SMS/Notification Content.
   */
  private render(step: WorkflowStep, context: EventContext) : WorkflowStep {
    for (const key in step) {
      try {
        const stepTemplate = step[key];
        const template = Handlebars.compile(stepTemplate.toString());
        step[key] = template(context.data);
      } catch (err) {
        Logger.error("[WorkflowEngineService] Unable to compile template using handlebars:", err)
      }
    }

    return step;
  }

  private async runStep(step: WorkflowStep, context: EventContext) {
    switch(step.action) {
      case WorkflowAction.SEND_EMAIL: 
        Logger.warn("WorkflowEngineService(): Workflow Step : SEND EMAIL")
        const { text, html } = await this.templateService.buildTemplate(step.templateId, context.data)
        return this.emailService.sendEmailMessage(step.from, step.to, step.subject, text, html);
      default: 
        Logger.error(`Unknownd workflow step type. skipping workflow step ${step.action}`)
    }
  }
}
