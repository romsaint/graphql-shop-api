import { RolesVariable } from "src/user/types/roles.type";
import { CreateUserDto } from "../reg/createUser.dto";
import { Field, ObjectType } from "@nestjs/graphql";
import { RolesVariableRegistration } from "src/user/types/rolesReg.type";

@ObjectType()
export class ReturnLogin {
    @Field()
    email: string;
    @Field()
    name: string;
    @Field()
    role: RolesVariable;
    @Field()
    token: string
    @Field()
    id: number
}