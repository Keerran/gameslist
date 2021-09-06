import {Body, Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../user/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {UserGuard} from "./user.guard";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post("/login")
    async login(@Req() req, @Res({passthrough: true}) res) {
        const accessToken = await this.authService.login(req.user);
        res.cookie("access_token", accessToken)
        const {password, ...user} = req.user ?? {};
        return {success: !!req.user,  ...user};
    }

    @Post("/logout")
    logout(@Res({passthrough: true}) res) {
        res.clearCookie("access_token");
        return {success: true};
    }

    @Post("/signup")
    signup(@Body() body) {
        return this.authService.signup(body);
    }

    @UseGuards(UserGuard)
    @Get("/user")
    user(@Req() req) {
        const {password, ...user} = req.user ?? {};
        console.log(user)
        return {isLoggedIn: !!req.user, ...user};
    }
}
