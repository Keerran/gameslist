import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Favourite {
    @ManyToOne(() => User, user => user.favourites, {primary: true})
    user: User;

    @PrimaryColumn()
    gameId: number;
}
