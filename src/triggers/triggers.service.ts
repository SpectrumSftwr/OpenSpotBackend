import { Injectable, Logger } from '@nestjs/common';
import { EventContext } from './dto/eventContext.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails, Trigger, TriggerTypes } from '@prisma/client';
import { FieldEqualsCondition, FieldInCondition, TimeCondition, TriggerCondition } from './dto/triggerCondition.dto';

@Injectable()
export class TriggersService {

  private triggers : Trigger[] = [];

  constructor(
    private prismaService: PrismaService,
  ) {}

  async loadTriggersFromDb(){
    this.triggers = await this.prismaService.trigger.findMany({orderBy: {
      createdByUserId: 'asc',
    }});

    Logger.log(`[TriggersService] Loaded ${this.triggers.length} triggers`);
  }

  async reloadTriggers() {
    await this.loadTriggersFromDb();
  }

  registerTrigger(trigger: Trigger) {
    this.triggers.push(trigger);
  }

  /**
   * Evaluates an event context to get all triggers that need to be fired.
   */
  async evaluateTriggers(eventContext: EventContext): Promise<any[]> {
    Logger.log("eventContext");
    Logger.log(eventContext);
    Logger.log("this.triggers");
    Logger.log(this.triggers);

    return this.triggers.filter(t => t.type === TriggerTypes.USER_BASED 
                                && t.eventType === eventContext.type
                                && t.createdByUserId === eventContext.belongsTo.user_id);
  }

  /**
   * Gets a list of triggers that need to be fired off based on time.
   */
  async findDueTriggers(): Promise<{ trigger: Trigger, event: BookingDetails}[]> {
    const timeTriggers = this.triggers.filter(t => {
      return t.type === 'TIME_BASED' //&& new Date(conditionJson.someDate) <= now
    });

    // Define the results object.
    const results: {
      trigger: Trigger, 
      event: BookingDetails
    }[] = []

    let prevBusinessId = -1;
    let bookingDetails : BookingDetails[] = [];

    for (const trigger of timeTriggers) {
      const triggerCondition = trigger.condition as any as TriggerCondition;
      // Only Update the booking Details list when the trigger belongs to a new User Triggers are ordered by user.
      bookingDetails = (bookingDetails.length !== 0 && prevBusinessId  !== -1 &&  prevBusinessId === trigger.createdByUserId)
              ?  bookingDetails
              : await this.prismaService.bookingDetails
                              .findMany({where: {
                                  business_id: trigger.business_id,
                              }});

      for (const event of bookingDetails)  {
        switch (triggerCondition.type) {
          case 'time-offset':
            if(this.shouldTriggerByTime(event, triggerCondition)) {
            results.push({
              trigger: trigger,
              event: event,
            })
          }
          break;
          case 'field-equals':
            if(this.shouldTriggerByFieldEquals(event, triggerCondition)) {
            results.push({
              trigger: trigger,
              event: event,
            })
          }
          break;
          case 'field-in':
            if(this.shouldTriggerByFieldIn(event, triggerCondition)) {
            results.push({
              trigger: trigger,
              event: event,
            })
          }
          break;
          default: 
            break;

        }
      }

      prevBusinessId = trigger.createdByUserId;
    }

    return results;
  }

  private shouldTriggerByTime(event: BookingDetails, triggerCondition: TimeCondition) : boolean {
    const targetDate = new Date(event[triggerCondition.targetField]);
    const now = new Date();
    const diffIfMS = (targetDate.getTime() - now.getTime())
    const msInDay = 1000 * 60 * 60 * 24;

    const diff = (Math.floor(diffIfMS / msInDay) == triggerCondition.offsetDays) 
    return diff;
  }


  // TODO: SUPPORT FOR FIELD IN STATUS NOT SUPPORTED YET, WILL BE REQUIRED FOR TRIGGERS THAT ARE CAUSED BY STAUS CHANGE.
  private shouldTriggerByFieldIn(event: BookingDetails, triggerCondition: FieldInCondition) : boolean {
    return triggerCondition.values.includes(event[triggerCondition.field]);
  }

  // TODO: SUPPORT FOR FIELD EQUALS NO SUPPORTED YET.
  private shouldTriggerByFieldEquals(event: BookingDetails, triggerCondition: FieldEqualsCondition) : boolean {
    // TODO : Make this know what table is required to be checked.
    return event[triggerCondition.field] === triggerCondition.value;
  }

}{}
