import { Field, ID, ObjectType } from "@nestjs/graphql";
import { RolesVariable } from "../types/roles.type";
import { Shop } from "../../shop/entities/shop.entity";


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

    @Field()
    email: string
}