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
   ],
})
export class AppModule {}
