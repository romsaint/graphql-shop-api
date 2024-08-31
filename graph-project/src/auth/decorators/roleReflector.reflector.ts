import { Reflector } from "@nestjs/core";
import { RolesVariable } from "src/user/types/roles.type";

export const RolesReflector = Reflector.createDecorator<RolesVariable[]>()