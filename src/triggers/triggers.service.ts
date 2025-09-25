import { Injectable, Logger } from '@nestjs/common';
import { EventContext } from './dto/eventContext.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails, Trigger, TriggerTypes } from '@prisma/client';
import { FieldEqualsCondition, FieldInCondition, LogicalCondition, TimeCondition, TriggerCondition } from './dto/triggerCondition.dto';
import { every } from 'rxjs';

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
      //
      // Only Update the booking Details list when the trigger belongs to a new User Triggers are ordered by user.
      bookingDetails = (bookingDetails.length !== 0 && prevBusinessId  !== -1 &&  prevBusinessId === trigger.createdByUserId)
        ?  bookingDetails
        : await this.prismaService.bookingDetails
        .findMany({
          where: {
            business_id: trigger.business_id,
          },
          include: {
            request:true,
          }
        });


        for (const event of bookingDetails)  {
          if (this.shouldTriggerOnCondition(event, triggerCondition)) {
            results.push({
              trigger: trigger,
              event: event,
            })
          }
        }

        prevBusinessId = trigger.createdByUserId;
    }

    return results;
  }

  async shouldTriggerOnCondition(event: any, triggerCondition: TriggerCondition) : Promise<boolean> {

    let shouldTrigger = false;

    switch (triggerCondition.type) {
      case 'time-offset':
        // TODO: Make this so that a user can choose what status the event should be in. SEE GPT RESULTS.
        if(this.shouldTriggerByTime(event, triggerCondition) && await this.isEventAcceptedStatus(event)) {
          shouldTrigger = true;
        }
      break;
      case 'field-equals':
        if(this.shouldTriggerByFieldEquals(event, triggerCondition)) {
          shouldTrigger = true;
        }
      break;
      case 'field-in':
        if(this.shouldTriggerByFieldIn(event, triggerCondition)) {
          shouldTrigger = true;
        }
      break;
      case 'and':
        case 'or':
        if(this.shouldTriggerLogicalCondition(event, triggerCondition)) {
          shouldTrigger = true;
        }
      break;
      default: 
        break;
    }

    return shouldTrigger;

  }

  private shouldTriggerByTime(event: BookingDetails, triggerCondition: TimeCondition) : boolean {
    const targetDate = new Date(event[triggerCondition.targetField]);
    const now = new Date();
    const diffIfMS = (targetDate.getTime() - now.getTime())
    const msInDay = 1000 * 60 * 60 * 24;

    const diff = (Math.floor(diffIfMS / msInDay) == triggerCondition.offsetDays) 
    return diff; 
  }

  /**
   * Checks if the event is in a accepted status.
   */
  private async isEventAcceptedStatus(event: BookingDetails) {
    const eventStatus = await this.prismaService.request.findFirst({
      where: {
        booking_id: event.id,
      }
    })

    return eventStatus.status == "APPROVED";
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

  /**
   * Processes all conditions of a "Logical" Conditional
   */
  private shouldTriggerLogicalCondition(event: BookingDetails, triggerCondition: LogicalCondition) : boolean {
    let areConditionsMet = false; 
    if (triggerCondition.type == 'and') {
      areConditionsMet = triggerCondition.conditions.every(c => this.shouldTriggerOnCondition(event, c))
    } else {
      areConditionsMet = triggerCondition.conditions.some(c => this.shouldTriggerOnCondition(event, c))
    }
    return areConditionsMet;

  }

}{}
