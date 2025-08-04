export enum EmittableType {
  USER_CREATED_EVENT = 'user.createdEvent',
  SCHEDULED_TRIGGER_EVENT = 'trigger.fired',
}

export class EmittableContext {
  trigger_type: String;
  data: any;
}
