import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { BaseProductDto } from "./baseProduct.dto";


@ObjectType()
export class ProductDto extends BaseProductDto {
    @Field(type => ID)
    product_id: number
}