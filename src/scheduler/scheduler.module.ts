// scheduler.module.ts
import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TriggersModule } from '../triggers/triggers.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { WorkflowsModule } from 'src/workflows/workflows.module';
import { TemplateContextModule } from 'src/template-context/template-context.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    TriggersModule, 
    EventBusModule, 
    WorkflowsModule,
    TemplateContextModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}

