import { Module } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoriesProviders, RepositoriesModule } from "../repositories";
import { TestRepo } from "./test-repo";
import { TestRepo2 } from "./test-repo-2";
import { ExtendedEntityRepository } from "./extended-entity-repo";

@Module({
    imports: [
        RepositoriesModule
    ],
    providers: [
        ConnectionService,
        ...RepositoriesProviders([
            TestRepo,
            TestRepo2,
            ExtendedEntityRepository
        ])
    ]
})
export class TestModule {}
