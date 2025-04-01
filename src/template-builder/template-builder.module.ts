import { Module } from '@nestjs/common';
import { TemplateBuilderService } from './template-builder.service';

@Module({
  providers: [TemplateBuilderService],
  exports: [TemplateBuilderService]
})
export class TemplateBuilderModule {}
