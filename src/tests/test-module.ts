import { Module } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoriesProviders } from "../repositories/repositories-providers";
import { TestRepo } from "./test-repo";

@Module({
    providers: [
        ConnectionService, 
        ...RepositoriesProviders([
            TestRepo
        ])
    ]
})
export class TestModule {}
