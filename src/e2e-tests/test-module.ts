import { Module } from "@nestjs/common";
import { ConnectionService, RepositoriesModule, repositoryFactoryProvider } from "../";
import { TestRepo } from "./test-repo";
import { TestRepo2 } from "./test-repo-2";
import { ExtendedEntityRepository } from "./extended-entity-repo";

@Module({
    imports: [
        RepositoriesModule
    ],
    providers: [
        ConnectionService,
        repositoryFactoryProvider(TestRepo),
        repositoryFactoryProvider(TestRepo2),
        repositoryFactoryProvider(ExtendedEntityRepository)
    ]
})
export class TestModule {}
