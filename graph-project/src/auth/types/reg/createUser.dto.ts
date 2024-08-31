import { Field, InputType } from "@nestjs/graphql"
import { Exclude } from "class-transformer"
import { IsEmail, IsEnum, IsStrongPassword } from "class-validator"
import { RolesVariable } from "src/user/types/roles.type"
import { RolesVariableRegistration, RolesVariableRegistrationEnum } from "src/user/types/rolesReg.type"


@InputType()
export class CreateUserDto {
    @Field()
    @IsEmail()
    email: string
    
    @Field()
    name: string

    //@IsStrongPassword()
    @Field()
    password: string
}