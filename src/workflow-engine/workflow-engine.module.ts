import { Module } from '@nestjs/common';
import { WorkflowEngineService } from './workflow-engine.service';
import { TemplateBuilderModule } from 'src/template-builder/template-builder.module';

@Module({
  providers: [WorkflowEngineService],
  exports: [WorkflowEngineService],
  imports: [TemplateBuilderModule]
})
export class WorkflowEngineModule {}
