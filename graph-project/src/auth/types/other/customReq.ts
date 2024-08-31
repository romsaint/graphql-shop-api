import { UserJwtType } from "./userJwt.type";

export class ICustomRequest extends Request {
    user: UserJwtType
}