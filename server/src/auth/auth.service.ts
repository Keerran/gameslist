import {Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/user.entity";
import {DeepPartial} from "typeorm";

interface UserDto {
    username: string,
    password1: string,
    password2: string
}

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string) {
        const user = await this.userService.fromUsername(username, {relations: ["favourites"]});
        if(user && await bcrypt.compare(pass, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {username: user.username, sub: user.id};
        return this.jwtService.sign(payload);
    }

    async signup(data: UserDto) {
        let user = await this.userService.fromUsername(data.username);
        if(user)
            return {success: false, message: "User already exists."}
        else if (data.password1 !== data.password2)
            return {success: false, message: "Passwords must match."}
        else {
            user = await this.userService.create({username: data.username, password: data.password1});

            await this.login(user);

            return {success: true, user};
        }
    }
}
