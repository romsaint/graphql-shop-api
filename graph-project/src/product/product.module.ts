import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [CacheModule.register(), HttpModule],
  providers: [ProductResolver, ProductService, PrismaService],
})


export class ProductModule {}