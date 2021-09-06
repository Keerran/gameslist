import {forwardRef, Module} from '@nestjs/common';
import {EntriesService} from "./entries.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Entry} from "./entry.entity";
import {UserModule} from "../user/user.module";
import {EntriesController} from "./entries.controller";

@Module({
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Entry])],
    providers: [EntriesService],
    controllers: [EntriesController],
    exports: [EntriesService]
})
export class EntriesModule {}
