import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { UserpageModule } from './userpage/userpage.module';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    PrismaModule, 
    ConfigModule.forRoot({
    isGlobal: true,
    }), 
    EmailModule, UserpageModule,
   ],
})
export class AppModule {}
