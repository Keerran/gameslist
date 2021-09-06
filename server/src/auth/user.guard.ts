import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class UserGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if(err)
            throw err;
        return user;
    }
}
