import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import UserService from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BusinessModule } from 'src/business/business.module';
import { BusinessService } from 'src/business/business.service';

@Module({
  imports: [
    UserModule, 
    BusinessModule,
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET, 
    signOptions: {expiresIn: '2h'},
  })],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService, 
  ],
  exports: [AuthService]
})
export class AuthModule {}
