import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../../consts";
import { TestEntityRepository } from "./base/test-entity.repository";
import { PageTestEntityRepository } from "./page/page-test-entity.repository";
import { NestedTestEntityRepository } from "./nested/nested-test-entity.repository";

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
        repositoryFactoryProvider(PageTestEntityRepository),
        repositoryFactoryProvider(NestedTestEntityRepository)
    ]
})
export class TestModule {}
