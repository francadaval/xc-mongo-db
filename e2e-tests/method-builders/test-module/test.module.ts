import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../../consts";
import { TestEntityRepository } from "./test-entity.repository";
import { PageTestEntityRepository } from "./page-test-entity.repository";

@Module({
    imports: [
        RepositoriesModule.registerAsync({
            useFactory: () => {
                return {
                    connectionUri: TEST_URI
                };
            }
        })
    ],
    providers: [
        repositoryFactoryProvider(TestEntityRepository),
        repositoryFactoryProvider(PageTestEntityRepository)
    ]
})
export class TestModule {}
