import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import {User} from "./user/user.entity";
import {Entry} from "./entries/entry.entity";
import {Favourite} from "./user/favourite.entity";
import { GamesModule } from './games/games.module';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "kirran",
      password: "Sunf44ast",
      database: "gameslist",
      entities: [User, Entry, Favourite],
      synchronize: true,
      logging: false
  }), AuthModule, GamesModule, EntriesModule],
})
export class AppModule {}
