import {Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {GamesService} from "../games/games.service";
import {Entry} from "../entries/entry.entity";
import {EntriesService} from "../entries/entries.service";
import {AuthGuard} from "@nestjs/passport";

type EntryMap = Record<number, Record<string, Entry>>;

@Controller("/user")
export class UserController {
    constructor(
        private entries: EntriesService,
        private users: UserService,
        private api: GamesService
    ) {}

    @Get("/:user")
    async profile(@Param("user") username: string) {
        const user = await this.users.fromUsername(username, {relations: ["entries", "favourites"]});

        if(!user)
            throw new NotFoundException();

        const games = await this.api.get(`fields name,cover.url; where id = (${user.entries.map(e => e.gameId)}); limit ${user.entries.length};`);

        const gameMap = this.api.dataToMap(games.data)

        user.entries = user.entries.sort((a, b) => b.rating - a.rating)

        const entries = user.entries.reduce((map, entry) => {
            if (map[entry.status]) {
                map[entry.status].push(entry);
            }
            else {
                map[entry.status] = [entry]
            }

            return map
        }, {});

        return {
            username: user.username,
            entries: entries,
            games: gameMap
        }
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("/favourite")
    async favourite(@Req() req) {
        await this.users.favourite(req.user, +req.body.gameId);
        const user = await this.users.fromId(req.user.id, {relations: ["favourites"]});

        console.log(user);

        return {user}
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("/:user/compare")
    async compare(@Req() req) {
        const other = await this.users.fromUsername(req.params.user);
        const entries = await this.entries.compare(req.user, other) as Entry[];
        const entryMap = entries.reduce((map, entry) => {
            if(!map[entry.gameId])
                map[entry.gameId] = {};

            map[entry.gameId][entry.user.username] = entry;

            return map;
        }, {} as EntryMap)

        const rawGameData = await this.api.get(`fields name; where id = (${Object.keys(entryMap).join()});`)

        const games = this.api.dataToMap(rawGameData.data);

        return {entries: entryMap, games};
    }
}
