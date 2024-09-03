import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { RestAuthService } from "../rest-auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly restAuthService: RestAuthService
    ) {
        super({
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('CLIENT_SECRET'),
            callbackURL: 'http://127.0.0.1:3000/rest/auth/google-auth/redirect',
            scope: 'profile'
        })
    }

    validate(accessToken: string, refreshToke: string, profile: any, done: Function) {
        const user = this.restAuthService.validateGoogleUser(profile)

        done(null, user)
    }
}