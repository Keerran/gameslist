import {Inject, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {lastValueFrom} from "rxjs";
import {AxiosResponse} from "axios";
import {clientId} from "../shared/constants";

interface Game {
    id: number,
    name: string,
    cover: {
        url: string
    }
}

@Injectable()
export class GamesService {
    private url = "https://api.igdb.com/v4/";

    constructor(
        private httpService: HttpService,
        @Inject("IGDB_TOKEN")
        private accessToken: string
    ) {}

    private request(url: string, body: string) {
        return lastValueFrom(this.httpService.post(this.url + url, body, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${this.accessToken}`
            }
        }));
    }

    cover(body: string) {
        return this.request("covers/", body);
    }

    get(body: string) {
        return this.request("games/", body);
    }

    dataToMap(data: any) {
        return data.reduce((map, obj: Game) => {
            map[obj.id] = obj
            return map;
        }, {})
    }
}
