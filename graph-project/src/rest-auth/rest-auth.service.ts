import { Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RestAuthService {
    async validateGoogleUser(profile: any): Promise<any> {
        const { id, displayName, emails, photos } = profile;
        const user = {
          id,
          displayName,
          email: emails && emails.length ? emails[0].value : null,
          photo: photos && photos.length ? photos[0].value : null,
        };
        console.log(user)
      
        return user;
      }
}
