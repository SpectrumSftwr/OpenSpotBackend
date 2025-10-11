import { Injectable, Logger } from '@nestjs/common';
import { EventContext } from './dto/eventContext.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDetails, Trigger, TriggerTypes } from '@prisma/client';
import { FieldEqualsCondition, FieldInCondition, LogicalCondition, TimeCondition, TriggerCondition } from './dto/triggerCondition.dto';
import { BookingDetailsWithRequestDetails } from 'src/common/types/BookingDetailTypes';


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
                                && t.business_id === eventContext.belongsTo.id);
  }

  /**
   * Gets a list of triggers that need to be fired off based on time.
   */
  async findDueTriggers(): Promise<{ trigger: Trigger, event: BookingDetails}[]> {
    const timeTriggers = this.triggers.filter(t => {
      return t.type === 'TIME_BASED' //&& new Date(conditionJson.someDate) <= now
    });

    // Define the results object.
    const results:{
      trigger: Trigger, 
      event: BookingDetails
    }[] = []

    let prevBusinessId = -1;
    let bookingDetails : BookingDetailsWithRequestDetails[] = [];

    for (const trigger of timeTriggers) {
      const triggerCondition = trigger.condition as any as TriggerCondition;

      // Only Update the booking Details list when the trigger belongs to a new User Triggers are ordered by user.
      bookingDetails = (bookingDetails.length !== 0 && prevBusinessId === trigger.business_id)
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
            let shouldTrigger = this.shouldTriggerOnCondition(event, triggerCondition);

            if (shouldTrigger) {
              results.push({
                trigger: trigger,
                event: event,
              })
            }
          }

          prevBusinessId = trigger.business_id;
    }

    return results;
  }

  shouldTriggerOnCondition(event: BookingDetailsWithRequestDetails, triggerCondition: TriggerCondition) : boolean {

    let shouldTrigger = false;

    switch (triggerCondition.type) {
      case 'time-offset':
        shouldTrigger = this.shouldTriggerByTime(event, triggerCondition) 
      break;
      case 'field-equals':
        shouldTrigger = this.shouldTriggerByFieldEquals(event, triggerCondition)
      break;
      case 'field-in':
        shouldTrigger = this.shouldTriggerByFieldIn(event, triggerCondition)
      break;
      case 'and':
      case 'or':
        shouldTrigger = this.shouldTriggerLogicalCondition(event, triggerCondition)
      break;
      default: 
        Logger.warn(`[Trigger.service] Trigger Condition Type Not Found: ${triggerCondition}`)
      break;
    }

    return shouldTrigger;

  }

  private shouldTriggerByTime(event: BookingDetailsWithRequestDetails, triggerCondition: TimeCondition) : boolean {

    const currentValue = event[triggerCondition.targetField];
    const targetDate = new Date(currentValue);
    targetDate.setHours(0,0,0,0)

    const now = new Date();
    now.setHours(0,0,0,0);

    const diffInMS = (now.getTime() - targetDate.getTime())
    const msInDay = (1000 * 60 * 60 * 24);
    const diffDays = Math.round( diffInMS / msInDay);


    const diff = (diffDays == triggerCondition.offsetDays) 
    return diff; 

  }


  // TODO: SUPPORT FOR FIELD IN STATUS NOT SUPPORTED YET, WILL BE REQUIRED FOR TRIGGERS THAT ARE CAUSED BY STAUS CHANGE.
  private shouldTriggerByFieldIn(event: BookingDetailsWithRequestDetails, triggerCondition: FieldInCondition) : boolean {
    const currentValue = this.getNestedValue(event, triggerCondition.field);

    const results =  triggerCondition.values.includes(currentValue);
    return results;
  }

  private shouldTriggerByFieldEquals(event: BookingDetailsWithRequestDetails, triggerCondition: FieldEqualsCondition) : boolean {
    const eventValue = this.getNestedValue(event, triggerCondition.field);
    const results = eventValue === triggerCondition.value;
    return results;
  }

  /**
   * Method to get the actual value of nested fields
   */
  getNestedValue(event: BookingDetailsWithRequestDetails, path: string) {
    return path.split('.')                        
        .reduce((acc, key) => {            
            if (acc && typeof acc === 'object' && key in acc) {
                return acc[key];               
            }
            return undefined;               
        }, event);
  }

  /**
   * Processes all conditions of a "Logical" Conditional
   */
  private shouldTriggerLogicalCondition(event: BookingDetailsWithRequestDetails, triggerCondition: LogicalCondition) : boolean {
    let areConditionsMet = false; 

    if (triggerCondition.type == 'and') {
      const triggerConditions = triggerCondition.conditions as TriggerCondition[];

      areConditionsMet = triggerConditions.map(c => {
        const result = this.shouldTriggerOnCondition(event, c)
        return result;
      }).every(c => c);
    } else {
      areConditionsMet = triggerCondition.conditions.some(c => this.shouldTriggerOnCondition(event, c))
    }
    return areConditionsMet;

  }

}{}
