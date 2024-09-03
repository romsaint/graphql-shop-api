import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from './entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Product } from './entities/product.entity';
import { ApolloError } from 'apollo-server';


@Injectable()
export class UserService {
    constructor(private readonly prismaClient: PrismaService) { }

    async getUser(id: number): Promise<User> {
        try {
            const user: User = await this.prismaClient.users.findFirst({ where: { id } });
            if (!user) {
                throw new ApolloError('User not found', 'NOT_FOUND')
            }
            return user

        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getAllUsers(): Promise<User[]> {
        return await this.prismaClient.users.findMany();
    }

    async getShopById(shopId: number): Promise<Shop> {
        try {
            if (!shopId) {
                throw new ApolloError("There's no such shop id", 'NOT_FOUND');
            }

            return await this.prismaClient.shops.findFirst({ where: { shop_id: shopId } });
        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }

    async getUserProducts(shopId: number) {
        try {
            if (!shopId) {
                throw new ApolloError("There's no such shop id ", 'NOT_FOUND')
            }
            return await this.prismaClient.products.findMany({
                where: {
                    shops: {
                        some: {
                            shopId
                        }
                    }
                }
            })

        } catch (e) {
            throw new ApolloError(e.message, e.extensions.code || 'SERVER_ERROR')
        }
    }
}