import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { BaseProductDto } from "./baseProduct.dto";


@InputType()
export class ProductDtoCreate extends BaseProductDto { }