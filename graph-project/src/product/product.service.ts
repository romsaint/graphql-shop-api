import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductDto } from './entities/product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ProductDtoCreate } from './entities/productCreate.dto';
import { ICustomRequest } from 'src/auth/types/other/customReq';
import { ApolloError } from 'apollo-server';
import { GetProductsType } from './entities/getProducts.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prismaClient: PrismaService) { }

    async createProducts(products: ProductDtoCreate[], req: ICustomRequest): Promise<ProductDto[]> {
        try {
            const user = await this.prismaClient.users.findFirst({ where: { id: req.user.id } })

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

                return data
            }
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getProducts(shopId: number, page: number): Promise<GetProductsType> {
        if (page < 0) {
            throw new ApolloError('Page number must be non-negative');
        }

        const pageSize = 5;
        const skip = page * pageSize;

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

        return {
            products,
            totalPages,
            currentPage: page,
            pageSize
        } as GetProductsType;
    }
}

