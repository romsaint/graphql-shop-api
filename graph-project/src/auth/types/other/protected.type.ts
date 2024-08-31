import { Field, ObjectType } from "@nestjs/graphql";
import { ReturnReg } from "../reg/registration.type";
import { UserJwtType } from "./userJwt.type";

@ObjectType()
export class ProtectedRouteType {
  @Field()
  route: UserJwtType;
}