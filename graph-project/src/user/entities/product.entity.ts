import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Product {
    @Field(type => ID)
    product_id: number

    @Field()
    product_name: string

    @Field()
    product_description: string

    @Field()
    product_price: number
}