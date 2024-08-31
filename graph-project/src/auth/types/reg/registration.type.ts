import { RolesVariable } from "src/user/types/roles.type";
import { CreateUserDto } from "./createUser.dto";
import { Field, ObjectType } from "@nestjs/graphql";
import { RolesVariableRegistration } from "src/user/types/rolesReg.type";

@ObjectType()
export class ReturnReg implements Omit<CreateUserDto, 'password'> {
    @Field()
    email: string;
    @Field()
    name: string;
    @Field()
    role: RolesVariableRegistration;
    @Field()
    token: string
    @Field()
    id: number
}