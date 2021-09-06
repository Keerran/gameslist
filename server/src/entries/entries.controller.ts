import {Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import {EntriesService} from "./entries.service";
import {Entry, Status} from "./entry.entity";
import {UserService} from "../user/user.service";
import {AuthGuard} from "@nestjs/passport";

interface EntryDto {
    game: number,
    status: Status,
    rating: number,
    playtime: number,
    note: string
}

@Controller("/entries")
export class EntriesController {
    constructor(
        private users: UserService,
        private entries: EntriesService
    ) {}

    @UseGuards(AuthGuard("jwt"))
    @Post("/")
    async post(@Req() req, @Body() body: EntryDto) {
        const entry = await this.entries.create({user: req.user, ...body});
        return entry;
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("/:user/:game")
    async put(@Param("user") username: string, @Param("game") gameId: number, @Req() req) {
        if(username !== req.user.username)
            throw new UnauthorizedException();

        const user = await this.users.fromUsername(username);
        let entry = await this.entries.get(gameId, user);

        req.body.rating ||= null;
        req.body.playtime ||= null;

        const partial = {user: req.user, gameId, ...req.body};

        if(!entry)
            entry = await this.entries.create(partial)
        else
            entry = await this.entries.save(partial);

        return entry
    }

    @Get("/:user/:game")
    async get(@Param("user") username: string, @Param("game") gameId: number) {
        const user = await this.users.fromUsername(username);
        const entry = await this.entries.get(gameId, user);

        return entry;
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("/:user/:game")
    async delete(@Param("user") username: string, @Param("game") gameId: number, @Req() req) {
        if (username !== req.user.username)
            throw new UnauthorizedException();

        const result = await this.entries.delete({user: req.user, gameId})

        return result.affected;
    }
}
