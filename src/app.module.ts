import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { UserpageModule } from './userpage/userpage.module';
import { EventsModule } from './events/events.module';
import { ProviderModule } from './provider/provider.module';
import { TemplateBuilderModule } from './template-builder/template-builder.module';
import { EventBusService } from './event-bus/event-bus.service';
import { EventBusModule } from './event-bus/event-bus.module';
import { TriggersModule } from './triggers/triggers.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ListenersModule } from './listeners/listeners.module';
import { WorkflowEngineModule } from './workflow-engine/workflow-engine.module';
import { TemplateContextModule } from './template-context/template-context.module';
import { UserStorageModule } from './user-storage/user-storage.module';
import { BusinessModule } from './business/business.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    AuthModule, 
    UserModule, 
    PrismaModule, 
    EmailModule, 
    UserpageModule,
    UserpageModule,
    EventsModule,
    ProviderModule,
    TemplateBuilderModule,
    EventBusModule,
    TriggersModule,
    WorkflowsModule,
    SchedulerModule,
    ListenersModule,
    WorkflowEngineModule,
    TemplateContextModule,
    UserStorageModule,
    BusinessModule,
   ],
  providers: [EventBusService],
})
export class AppModule {}
