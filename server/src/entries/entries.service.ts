import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, Repository} from "typeorm";
import {Entry} from "./entry.entity";
import {User} from "../user/user.entity";
import {FindConditions} from "typeorm/find-options/FindConditions";

@Injectable()
export class EntriesService {
    constructor(
        @InjectRepository(Entry)
        private entries: Repository<Entry>
    ) {
    }

    async create(entryPartial: DeepPartial<Entry>) {
        const entry = this.entries.create(entryPartial);
        await this.entries.save(entry);
        return entry;
    }

    delete(entryPartial: FindConditions<Entry>) {
        return this.entries.delete(entryPartial);
    }

    save(entryPartial: DeepPartial<Entry>) {
        return this.entries.save(entryPartial);
    }

    getAll() {
        return this.entries.find();
    }

    get(gameId: number, user: User) {
        return this.entries.findOne({gameId, user});
    }

    fromUser(user: User) {
        return this.entries.find({user});
    }

    compare(user: User, other: User) {
        return this.entries
            .createQueryBuilder("users")
            .select()
            .innerJoinAndSelect("users.user", "user")
            .innerJoin("entry", "others", `users.gameId = others.gameId
                                           AND users.userId != others.userId
                                           AND users.userId IN (:id1, :id2)
                                           AND others.userId IN (:id1, :id2)`, {id1: user.id, id2: other.id})
            .getMany();
    }
}
