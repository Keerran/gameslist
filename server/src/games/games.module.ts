import { Module } from "@nestjs/common";
import {HttpModule, HttpService} from "@nestjs/axios";
import {GamesService} from "./games.service";
import {GamesController} from "./games.controller";
import {lastValueFrom} from "rxjs";
import {clientId, clientSecret} from "../shared/constants";

const igdbToken = {
    provide: "IGDB_TOKEN",
    useFactory: async (httpService: HttpService) => {
        try {
            const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
            const res = await lastValueFrom(httpService.post(url));
            return res.data.access_token;
        }
        catch (err) {
            throw err;
        }
    },
    inject: [HttpService]
}

@Module({
    imports: [HttpModule],
    providers: [igdbToken, GamesService],
    controllers: [GamesController],
    exports: [GamesService]
})
export class GamesModule {}
