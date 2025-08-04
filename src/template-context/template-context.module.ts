import { Module } from '@nestjs/common';
import { TemplateContextService } from './template-context.service';

@Module({
  providers: [TemplateContextService],
  exports: [TemplateContextService]
})
export class TemplateContextModule {}
