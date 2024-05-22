import { Module } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoriesProviders } from "../repositories/repositories-providers";
import { TestRepo } from "./test-repo";
import { TestRepo2 } from "./test-repo-2";

@Module({
    providers: [
        ConnectionService,
        ...RepositoriesProviders([
            TestRepo,
            TestRepo2
        ])
    ]
})
export class TestModule {}
