import {Controller, forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {AuthController} from "../auth/auth.controller";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {GamesModule} from "../games/games.module";
import {EntriesModule} from "../entries/entries.module";
import {Favourite} from "./favourite.entity";

@Module({
    imports: [forwardRef(() => EntriesModule), GamesModule, TypeOrmModule.forFeature([User, Favourite])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
