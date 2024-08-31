import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { Exclude } from "class-transformer"
import { IsEmail, IsEnum, IsStrongPassword } from "class-validator"
import { RolesVariable } from "src/user/types/roles.type"
import { RolesVariableRegistration, RolesVariableRegistrationEnum } from "src/user/types/rolesReg.type"


@ObjectType()
export class UserJwtType {
    @Field()
    @IsEmail()
    email: string
    
    @Field()
    name: string

    @Field()
    id: number

    @Field() // Убедитесь, что используете правильный тип
    @IsEnum(RolesVariableRegistrationEnum)
    role: RolesVariableRegistration;
}