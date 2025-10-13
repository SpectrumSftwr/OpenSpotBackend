import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus/event-bus.service';
import { TriggersService } from '../triggers/triggers.service';
import { WorkflowsService } from '../workflows/workflows.service';
import { Trigger } from '@prisma/client';
import { EventContext } from 'src/triggers/dto/eventContext.dto';
import { EmittableType } from 'src/event-bus/dto/EmittableContext.dto';
import { Event } from '@aws-sdk/client-s3';

@Injectable()
export class TriggerListener {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly triggerService: TriggersService,
    private readonly workflowService: WorkflowsService,
  ) {

    this.eventBus.on(EmittableType.USER_CREATED_EVENT, this.handleEvent.bind(this));
    this.eventBus.on(EmittableType.SCHEDULED_TRIGGER_EVENT, this.handleTrigger.bind(this));

  }

  async handleEvent(context: EventContext) {
    const matchingTriggers = await this.triggerService.evaluateTriggers(context);
    Logger.log(`Found ${matchingTriggers.length} that need to be fired from User Action`);
    for (const trigger of matchingTriggers) {
      
      // Attach the trigger to the Event Context
      context.data.trigger = {
        sentAt: new Date().toLocaleString("en-US",{
              year: "numeric",
              month: "long",
              day: "numeric"
          }),
        trigger: trigger.type
      };

      await this.workflowService.executeWorkflow(trigger.workflowId, context);
    }
  }

  async handleTrigger({ trigger , context}: {trigger: Trigger, context: EventContext }) {

      context.data.trigger = {
        sentAt: new Date().toLocaleString("en-US",{
              year: "numeric",
              month: "long",
              day: "numeric"
          }),
        trigger: trigger.type
      };

      await this.workflowService.executeWorkflow(trigger.workflowId, context);
  }
}
