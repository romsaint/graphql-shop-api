import { Extensions, Field, ID, ObjectType } from "@nestjs/graphql";
import { RolesVariable } from "../types/roles.type";
import { Shop } from "../../shop/entities/shop.entity";
import { Roles } from "@prisma/client";


@ObjectType()
export class User {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    password?: string; // Рекомендуется не возвращать пароль в ответе GraphQL

    @Field()
    role: RolesVariable;

    @Field({ nullable: true })
    shopId?: number;

    @Field(type => Shop)
    shops?: Shop

    @Extensions({role: [Roles.ADMIN, Roles.MODERATOR]})
    @Field()
    email: string
}