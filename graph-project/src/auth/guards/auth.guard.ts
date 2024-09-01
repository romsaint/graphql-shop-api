import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesReflector } from "../decorators/roleReflector.reflector";
import { ApolloError } from "apollo-server";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ICustomRequest } from "../types/other/customReq";
import { PrismaService } from "prisma/prisma.service";
import { User } from "src/user/entities/user.entity";


@Injectable()
export class AuthProtectedGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prismaClient: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const ctx = GqlExecutionContext.create(context)
        const req: ICustomRequest = ctx.getContext().req

        const roles = this.reflector.getAllAndMerge(RolesReflector, [context.getHandler(), context.getClass()])
        const user = await this.prismaClient.users.findFirst({where: {id: req.user.id}})
      
        if (!req.user) {
            throw new UnauthorizedException('Unauthorized');
        }

        if(user) {
            if (!roles.includes(user.role)) {
                throw new ForbiddenException('Access denied due to insufficient rights');
            }
        }else{
            if (!roles.includes(req.user.role)) {
                throw new ForbiddenException('Access denied due to insufficient rights');
            }
        }
       

        return true
    }
}