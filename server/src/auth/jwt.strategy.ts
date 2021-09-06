import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "../user/user.service";

function cookieExtractor(req: Request & {cookies: any}) {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!
        });
    }

    async validate(payload: any) {
        return await this.userService.fromId(payload.sub, {relations: ["favourites"]});
    }
}
