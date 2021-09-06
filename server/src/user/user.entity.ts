import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BeforeInsert, OneToMany} from "typeorm";
import * as bcrypt from "bcrypt"
import {Entry} from "../entries/entry.entity";
import {Favourite} from "./favourite.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        unique: true,
    })
    username: string;

    @Column()
    password: string;

    // @Column()
    // image: string;

    @OneToMany(() => Favourite, favourite => favourite.user)
    favourites: Favourite[];

    @OneToMany(() => Entry, entry => entry.user)
    entries: Entry[];

    @BeforeInsert()
    async beforeInsert() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    async validatePass(pass: string) {
        return await bcrypt.compare(pass, this.password);
    }
}