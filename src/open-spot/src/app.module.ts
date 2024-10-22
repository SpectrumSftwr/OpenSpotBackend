import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SiteModule } from './site/sitesettings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FaqModule } from './faq/faq.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    PrismaModule, 
    ConfigModule.forRoot({
    isGlobal: true,
    }), 
    SiteModule, ReviewsModule, FaqModule, CalendarModule
   ],
})
export class AppModule {}
