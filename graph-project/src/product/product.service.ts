import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductDto } from './entities/product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ProductDtoCreate } from './entities/productCreate.dto';
import { ICustomRequest } from 'src/auth/types/other/customReq';
import { ApolloError } from 'apollo-server';
import { GetProductsType } from './entities/getProducts.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class ProductService {
    constructor(
        private readonly prismaClient: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    async createProducts(products: ProductDtoCreate[], req: ICustomRequest): Promise<ProductDto[]> {
        try {
            const user = await this.prismaClient.users.findFirst({ where: { id: req?.user?.id } })

            if (!user) {
                throw new UnauthorizedException()
            }

            if (Array.isArray(products)) {
                if (products.length === 0) {
                    throw new BadRequestException()
                }

                const data: ProductDto[] = await this.prismaClient.products.createManyAndReturn({ data: products })
                const ids: number[] = data.map(val => val.product_id)

                for (let i of ids) {
                    await this.prismaClient.shopsProducts.createMany({ data: { productId: i, shopId: user.shopId } })
                }

                await this.invalidateProductCache(user.shopId)

                return data
            }
        } catch (e) {
            throw new ApolloError(e.message, e?.extensions?.code || 'SERVER_ERROR')
        }
    }

    async getProducts(shopId: number, page: number): Promise<GetProductsType> {
        const cacheKey = `products_${shopId}_${page}`;
        const cachedData = await this.cacheManager.get<GetProductsType>(cacheKey);
      
        if (cachedData) {
            return cachedData;
        }

        if (page < 1) {
            throw new ApolloError('Page number must be non-negative');
        }

        const pageSize = 5;
        const skip = (page - 1) * pageSize;

        const [totalCount, products] = await Promise.all([
            this.prismaClient.products.count({
                where: {
                    shops: {
                        some: {
                            shopId 
                        }
                    }
                }
            }),
            this.prismaClient.products.findMany({
                where: {
                    shops: {
                        some: {
                            shopId
                        }
                    }
                },
                skip,
                take: pageSize
            })
        ]);
    
        const totalPages = Math.ceil(totalCount / pageSize);

        const result: GetProductsType = {
            products,
            totalPages,
            currentPage: page,
            pageSize
        };

        await this.cacheManager.set(cacheKey, result, 60); // Кешируем на 60 секунд

        return result;
    }

    async invalidateProductCache(shopId: number) {
        const keys = await this.cacheManager.store.keys();

        keys.forEach(async key => {
            if (key.startsWith(`products_${shopId}`)) {
                await this.cacheManager.del(key);
            }
        });
    }
}