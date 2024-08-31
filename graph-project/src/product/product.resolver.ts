import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductDtoCreate } from './entities/productCreate.dto';
import { ICustomRequest } from 'src/auth/types/other/customReq';
import { ProductDto } from './entities/product.dto';
import { UseGuards } from '@nestjs/common';
import { RolesReflector } from 'src/auth/decorators/roleReflector.reflector';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { AuthProtectedGuard } from 'src/auth/guards/auth.guard';
import { GetProductsType } from './entities/getProducts.dto';


@Resolver()
@RolesReflector(['SELLER'])
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @Mutation(returns => [ProductDto])
  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  async createProducts(
    @Args({ name: 'products', type: () => [ProductDtoCreate] }) products: ProductDtoCreate[],
    req: ICustomRequest,
  ): Promise<ProductDto[]> {
    return await this.productService.createProducts(products, req);
  }

  @RolesReflector(['USER'])
  @Query(returns => GetProductsType)
  @UseGuards(JwtAuthGuard, AuthProtectedGuard)
  async getProducts(
    @Args('shopId', { type: () => Int }) shopId: number,
    @Args('page', { type: () => Int }) page: number,
  ): Promise<GetProductsType> {
    return await this.productService.getProducts(shopId, page)
  }
}