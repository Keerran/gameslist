import {Controller, Get, NotFoundException, Param, Query} from "@nestjs/common";
import {GamesService} from "./games.service";

@Controller("/games")
export class GamesController {
    constructor(private api: GamesService) {}

    @Get("/search")
    async search(@Query() {query}) {
        query = query.replace('"', "");
        const results  = await this.api.get(`search "${query}"; fields name, cover.url, first_release_date, status;`);
        return results.data
    }

    @Get("/:id")
    async get(@Param("id") id: string) {
        if(+id === undefined)
            throw new NotFoundException()

        const fields = [
            "name",
            "cover.url",
            "first_release_date",
            "genres.name",
            "collection.name",
            "collection.games.name",
            "collection.games.cover.url",
            "platforms.name",
            "summary"
        ];

        const results = await this.api.get(`fields ${fields.join()}; where id=${id};`);

        return results.data[0];
    }
}
