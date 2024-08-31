import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"

@InputType()
export class BaseProductDto {
    @Field()
    product_name: string

    @Field()
    product_description: string

    @Field(type => Int)
    product_price: number
}