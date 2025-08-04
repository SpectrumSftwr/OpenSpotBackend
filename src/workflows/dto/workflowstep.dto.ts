export class WorkflowStep {
  action: WorkflowAction;
  to: string | undefined; 
  from: string | undefined;
  subject: string | undefined;
  templateId: number | undefined;
}

export enum WorkflowAction {
  SEND_EMAIL='send_email',
}

