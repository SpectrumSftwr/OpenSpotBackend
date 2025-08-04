import { Injectable, Logger } from '@nestjs/common';
import { Workflow } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkflowEngineService } from 'src/workflow-engine/workflow-engine.service';

@Injectable()
export class WorkflowsService {
  private workflows: Workflow[] = [];

  constructor(
    private prisma: PrismaService, 
    private workflowEngineService : WorkflowEngineService,
  ) {}

  async loadTriggersFromDb(){
    this.workflows = await this.prisma.workflow.findMany();
    Logger.log(`[WorkflowsService] Loaded ${this.workflows.length} workflows`);
  }

  async reloadTriggers() {
    await this.loadTriggersFromDb();
  }

  registerWorkflow(workflow: Workflow) {
    this.workflows.push(workflow);
  }

  async executeWorkflow(workflowId: number, context: any) {
    Logger.log(`Begining Execution of Workflow ID ${workflowId}`);
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf) return;

    this.workflowEngineService.runWorkflow(wf, context);
  }

}
