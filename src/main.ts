import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TriggersService } from './triggers/triggers.service';
import { WorkflowsService } from './workflows/workflows.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  // Load Triggers For Automation Workflows Pipeline.
  const triggersService = app.get(TriggersService);
  triggersService.reloadTriggers();

  // Load all Workflows
  const workflowService = app.get(WorkflowsService);
  workflowService.reloadTriggers();

  await app.listen(5000, '0.0.0.0');
}
bootstrap();
