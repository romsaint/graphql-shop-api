import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { Shop } from './entities/shop.entity';
import { HttpException, UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/user/entities/product.entity';
import { CreateShopType } from './types/createShopInputType.type';
import { RolesReflector } from 'src/auth/decorators/roleReflector.reflector';
import { AuthProtectedGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { ProtectedRouteType } from 'src/auth/types/other/protected.type';
import { ICustomRequest } from 'src/auth/types/other/customReq';

@Resolver(of => Shop)
@RolesReflector(['SELLER'])
export class ShopResolver {
  constructor(private readonly shopService: ShopService) { }

  @Mutation(returns => Shop)
  @RolesReflector(['USER'])
  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  async createShop(@Args('createShopObject') createShopType: CreateShopType, @Context('req') req): Promise<Shop> {
    return await this.shopService.createShop(createShopType, req)
  }

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @Query(returns => Shop)
  async getShop(@Args('shop_id', { type: () => Int }) id: number): Promise<Shop | null> {
    return await this.shopService.getShop(id)
  }

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @ResolveField(returns => User)
  async getUserByShopId(@Parent() shop: Shop) {
    return await this.shopService.getUserByShopId(shop.userId)
  }

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @ResolveField(returns => [Product])
  async getProductsByShopId(@Parent() shop: Shop) {
    return await this.shopService.getProductsByShopId(shop.shop_id)
  }

  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  @Mutation(returns => Shop)
  async deleteShop(@Args('shop_id') shopId: number, @Context('req') req: ICustomRequest): Promise<Shop> {
    return await this.shopService.deleteShop(shopId, req)
  }
}
