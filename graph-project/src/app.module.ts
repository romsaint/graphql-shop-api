import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { graphConnect } from './configs/graphql.config';
import { ShopModule } from './shop/shop.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth/auth.resolver';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { RestAuthModule } from './rest-auth/rest-auth.module';



@Module({
  imports: [
    graphConnect,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    HttpModule,
    UserModule,
    ShopModule,
    AuthModule,
    ProductModule,
    RestAuthModule
  ],
  providers: [PrismaService],
})
export class AppModule { }