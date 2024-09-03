import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RestAuthService } from './rest-auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('rest/auth')
export class RestAuthController {
  constructor(private readonly restAuthService: RestAuthService) { }

  @Get('google-auth')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google-auth/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return { user: req.user }
  }
}