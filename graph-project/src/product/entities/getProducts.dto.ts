import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ProductDto } from "./product.dto";

@ObjectType()
export class GetProductsType {
    @Field(type => [ProductDto])
    products: ProductDto[];

    @Field(type => Int)
    totalPages: number;

    @Field(type => Int)
    currentPage: number;

    @Field(type => Int)
    pageSize: number;
}