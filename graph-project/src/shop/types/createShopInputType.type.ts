import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateShopType {
    @Field()
    shop_name: string

    @Field()
    shop_description: string

    @Field()
    shop_turnover: number

    @Field()
    shop_average_price: number
}