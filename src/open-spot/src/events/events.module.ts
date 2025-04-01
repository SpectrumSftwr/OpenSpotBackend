import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TemplateBuilderModule } from 'src/template-builder/template-builder.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [TemplateBuilderModule]
})
export class EventsModule {}
