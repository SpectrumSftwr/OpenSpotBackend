import { Module } from '@nestjs/common';
import { TriggerListener } from './listeners.service';
import { TriggersModule } from 'src/triggers/triggers.module';
import { WorkflowsModule } from 'src/workflows/workflows.module';
import { EventBusModule } from 'src/event-bus/event-bus.module';

@Module({
  imports: [TriggersModule, WorkflowsModule, EventBusModule],
  providers: [TriggerListener],
  exports: [TriggerListener]
})
export class ListenersModule {}
