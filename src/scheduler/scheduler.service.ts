import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from 'src/event-bus/event-bus.service';
import { TriggersService } from 'src/triggers/triggers.service';
import { Cron, CronExpression} from '@nestjs/schedule'
import { WorkflowsService } from 'src/workflows/workflows.service';
import { EmittableType } from 'src/event-bus/dto/EmittableContext.dto';
import { TemplateContextService } from 'src/template-context/template-context.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventContext } from 'src/triggers/dto/eventContext.dto';

@Injectable()
export class SchedulerService {

  constructor(
    private readonly triggerService: TriggersService,
    private readonly workflowsService: WorkflowsService,
    private readonly eventBus: EventBusService,
    private templateContextService : TemplateContextService,
    private prisma : PrismaService,
  ){}

  /**
   * Method to reload all triggers and workflows daily before triggers are all run.
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: "reload-triggers-cron-job"
  }) // NOTE:  Cron = every hour at exactly the hour
  async reloadTriggers() {
    await this.triggerService.reloadTriggers();
    await this.workflowsService.reloadTriggers()
  }


  /**
   * Method to Run All triggers that need to be run.
   */
  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: "run-triggers-cron-job"
  }) 
  async checkTimeTriggers() {

    Logger.log("[SchedulerService.checkTimeTriggers] Starting Up Time Triggers.")

    const dueTriggerEvents = await this.triggerService.findDueTriggers();
    Logger.log(`[SchedulerService.checkTimeTriggers] Found ${dueTriggerEvents.length} event triggers that need to be run.`)
    
    // Emit the Trigger 
    for (const {trigger, event} of dueTriggerEvents) {
      let business = await this.prisma.business.findFirst({where: {
        user_id: trigger.createdByUserId,
      }})

      let context : EventContext = {
        type: trigger.type,
        belongsTo: business, 
        data: await this.templateContextService.buildContext(business, event),
      }


      this.eventBus.emit(EmittableType.SCHEDULED_TRIGGER_EVENT , {trigger, context});
    }

    Logger.log("[SchedulerService.checkTimeTriggers] Completed processing of all event triggers.")
  }

}
