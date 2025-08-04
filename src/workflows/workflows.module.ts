import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowEngineModule } from 'src/workflow-engine/workflow-engine.module';

@Module({
  imports: [WorkflowEngineModule],
  providers: [WorkflowsService],
  exports: [WorkflowsService]
})
export class WorkflowsModule {}
