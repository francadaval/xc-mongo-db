import { Module } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { TestRepo } from "./test-repo";

@Module({
    providers: [ConnectionService, TestRepo]
})
export class TestModule {}
