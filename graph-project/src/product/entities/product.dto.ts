import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { BaseProductDto } from "./baseProduct.dto";


@ObjectType()
export class ProductDto extends BaseProductDto {
    @Field()
    product_name: string

    @Field()
    product_description: string

    @Field(type => Int)
    product_price: number
    
    @Field(type => ID)
    product_id: number
}