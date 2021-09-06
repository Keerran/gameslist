import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {DeepPartial, FindOneOptions, Repository} from "typeorm";
import {Favourite} from "./favourite.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private users: Repository<User>,
        @InjectRepository(Favourite)
        private favourites: Repository<Favourite>,
    ) {}

    getAll() {
        return this.users.find();
    }

    fromId(id: number, options?: FindOneOptions<User>) {
        return this.users.findOne(id, options);
    }

    fromUsername(username: string, options?: FindOneOptions<User>) {
        return this.users.findOne({username}, options);
    }

    async favourite({favourites, ...user}: User, gameId: number) {
        const result = await this.favourites.delete({user, gameId});

        if(!result.affected) {
            const favourite = this.favourites.create({user, gameId});
            await this.favourites.save(favourite);
        }

        return !result.affected;
    }

    create(partial: DeepPartial<User>) {
        const user = this.users.create(partial);
        return this.users.save(user);
    }
}
