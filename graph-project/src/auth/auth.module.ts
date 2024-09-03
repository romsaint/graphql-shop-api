import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { GoogleStrategy } from '../rest-auth/stratetgy/google.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      signOptions: { expiresIn: '30d' }
    })],
  providers: [AuthResolver, AuthService, PrismaService, JwtService, JwtStrategy, ConfigService, LocalStrategy],
})
export class AuthModule { }