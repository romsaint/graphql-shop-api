import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from './types/reg/createUser.dto';
import { User } from 'src/user/entities/user.entity';
import { ReturnReg } from './types/reg/registration.type';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server';
import { LoginUserDto } from './types/login/login.dto';
import { JwtAuthGuard } from './guards/jwtAuthGuard.guard';
import { AuthGuard } from '@nestjs/passport';
import { ProtectedRouteType } from './types/other/protected.type';



@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ReturnReg)
  async registration(@Args('createUserDto') createUserDto: CreateUserDto): Promise<ReturnReg> {

    return await this.authService.registration(createUserDto)
  }

  @UseGuards(AuthGuard('local'))
  @Mutation(() => ReturnReg)
  async login(@Args('createUserDto') loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    
    if (!user) {
      throw new ApolloError('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
