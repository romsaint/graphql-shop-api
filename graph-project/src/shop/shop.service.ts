import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Shop } from './entities/shop.entity';
import { Product } from 'src/user/entities/product.entity';
import { CreateShopType } from './types/createShopInputType.type';
import { Request } from 'express';
import { ICustomRequest } from 'src/auth/types/other/customReq';
import { ApolloError } from 'apollo-server';

@Injectable()
export class ShopService {
    constructor(private readonly prismaClient: PrismaService) { }

    async createShop(createShopType: CreateShopType, req: ICustomRequest): Promise<Shop> {

        try {
            const createdShop = await this.prismaClient.$transaction(async (prisma) => {
                // Обновление роли пользователя
                await prisma.users.update({
                    where: { id: req.user.id },
                    data: { role: "SELLER" }
                });

                const shop = await prisma.shops.create({
                    data: { ...createShopType, userId: req.user.id }
                });

                await prisma.users.update({
                    where: { id: req.user.id },
                    data: { shopId: shop.shop_id }
                });
                
                req.user.role = 'SELLER'

                return shop;
            });

            return createdShop;
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getShop(id: number): Promise<Shop | null> {
        try {
            const shop = await this.prismaClient.shops.findFirst({ where: { shop_id: id } })

            if (shop) {
                return shop
            }

            throw new ApolloError('Shop not found', 'SHOP_NOT_FOUND', { shopId: id });
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getUserByShopId(user_id: number) {
        try {
            return await this.prismaClient.users.findFirst({ where: { id: user_id } })
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getProductsByShopId(shopId: number) {
        try {
            const products = await this.prismaClient.products.findMany({
                where: {
                    shops: {
                        some: {
                            shopId: shopId
                        }
                    }
                }
            });

            return products
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async deleteShop(shopId: number, req: ICustomRequest): Promise<Shop> {
        try {
            return await this.prismaClient.$transaction(async prisma => {
                const user = await this.prismaClient.users.findFirst({ where: { id: req.user.id } })

                if (!shopId) {
                    throw new BadRequestException()
                }

                if (!user || shopId !== user.shopId) {
                    throw new UnauthorizedException()
                }

                await this.prismaClient.users.update({ where: { id: user.id }, data: { role: "USER" } })

                req.user.role = 'USER'

                return await this.prismaClient.shops.delete({ where: { shop_id: shopId } })
            })
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }
}
