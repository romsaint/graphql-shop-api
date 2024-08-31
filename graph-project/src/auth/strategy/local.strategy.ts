import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UnauthorizedException } from "@nestjs/common";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({usernameField: 'email'})
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.authService.validateUser(email, pass)

        if (!user) {
            throw new UnauthorizedException();
        }
        
        return user;
    }
}