export interface TimeCondition {
  type: 'time-offset';
  targetField: string;
  offsetDays: number;
}

export interface FieldInCondition {
  type: 'field-in';
  field: string;
  values: (string | number)[];

}

export interface FieldEqualsCondition {
  type: 'field-equals';
  table: string;
  field: string;
  value: string | number | boolean;
}

export interface LogicalCondition {
  type : 'and' | "or";
  conditions: TriggerCondition[]
}

export type TriggerCondition =
  | TimeCondition
  | FieldInCondition
  | FieldEqualsCondition
  | LogicalCondition

