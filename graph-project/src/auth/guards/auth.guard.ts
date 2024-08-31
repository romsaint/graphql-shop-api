import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesReflector } from "../decorators/roleReflector.reflector";
import { ApolloError } from "apollo-server";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ICustomRequest } from "../types/other/customReq";


@Injectable()
export class AuthProtectedGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const req: ICustomRequest = ctx.getContext().req

        const roles = this.reflector.getAllAndMerge(RolesReflector, [context.getHandler(), context.getClass()])

        if (!req.user) {
            throw new UnauthorizedException('Unauthorized');
        }
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenException('Access denied due to insufficient rights');
        }

        return true
    }
}