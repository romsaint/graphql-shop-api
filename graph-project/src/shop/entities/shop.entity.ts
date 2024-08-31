import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Product } from "../../user/entities/product.entity"

@ObjectType()
export class Shop {
    @Field(type => ID)
    shop_id: number

    @Field()
    shop_name: string

    @Field({ nullable: true })
    shop_description?: string

    @Field()
    shop_turnover: number

    @Field()
    shop_average_price: number

    @Field()
    userId: number

    @Field(type => [Product], { nullable: true })
    products?: Product[]
}