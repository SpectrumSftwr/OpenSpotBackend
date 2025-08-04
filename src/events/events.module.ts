import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventBusModule } from 'src/event-bus/event-bus.module';
import { TemplateContextService } from 'src/template-context/template-context.service';
import { TemplateContextModule } from 'src/template-context/template-context.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [EventBusModule, TemplateContextModule]
})
export class EventsModule {}
