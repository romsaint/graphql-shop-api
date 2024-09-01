import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Shop } from '../shop/entities/shop.entity';
import { Product } from './entities/product.entity';
import { RolesReflector } from 'src/auth/decorators/roleReflector.reflector';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { AuthProtectedGuard } from 'src/auth/guards/auth.guard';


@RolesReflector(['ADMIN', 'MODERATOR'])
@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @Query(returns => User)
  async getUser(@Args('id') id: number, @Context() c: any) {
    return this.userService.getUser(id) 
  }

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @Query(returns => [User])
  async getAllUsers() {
    return this.userService.getAllUsers() 
  }

  @RolesReflector(['SELLER'])
  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @ResolveField(returns => Shop)
  async getShopById(@Parent() user: User): Promise<Shop> {
    return await this.userService.getShopById(user.shopId)
  }

  @RolesReflector(['SELLER'])
  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @ResolveField(returns => [Product], {name: "getProductsByUser"})
  async getUserProducts(@Parent() user: User) {
    return await this.userService.getUserProducts(user.shopId)
  }
}
