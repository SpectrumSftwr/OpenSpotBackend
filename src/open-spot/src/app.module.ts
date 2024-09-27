import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SitesettingsModule } from './sitesettings/sitesettings.module';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    PrismaModule, 
    ConfigModule.forRoot({
    isGlobal: true,
    }), 
    SitesettingsModule
   ],
})
export class AppModule {}
