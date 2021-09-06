import {Module} from '@nestjs/common';
import {UserModule} from "../user/user.module";
import {AuthController} from "./auth.controller";
import {LocalStrategy} from "./local.strategy";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            // signOptions: { expiresIn: "60s" }
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {
}
