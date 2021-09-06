import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../user/user.entity";

export enum Status {
    PLANNING = "Planning",
    PLAYING = "Playing",
    COMPLETED = "Completed",
    FULL_CLEARED = "100%'d",
    DROPPED = "Dropped"
}

@Entity()
export class Entry {
    @PrimaryColumn()
    gameId: number;

    // @PrimaryColumn({nullable: true})
    // userId: number
    //
    @ManyToOne(() => User, user => user.entries, {primary: true})
    user: User;

    @Column({
        type: "enum",
        enum: Status
    })
    status: Status;

    @Column("smallint")
    rating: number;

    @Column("integer", {nullable: true})
    playtime: number | null

    @Column()
    note: string;
}
