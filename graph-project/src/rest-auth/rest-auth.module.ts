import { Module } from '@nestjs/common';
import { RestAuthService } from './rest-auth.service';
import { RestAuthController } from './rest-auth.controller';
import { GoogleStrategy } from './stratetgy/google.strategy';

@Module({
  controllers: [RestAuthController],
  providers: [RestAuthService, GoogleStrategy],
})
export class RestAuthModule {}
