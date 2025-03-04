import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../consts";
import { BaseTestEntityRepository } from "./base/base-test-entity.repository";
import { PropertiesTestEntityRepository } from "./properties/properties-test-entity.repository";
import { NestingTestEntityRepository } from "./nesting/nesting-test-entity.repository";

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
        repositoryFactoryProvider(BaseTestEntityRepository),
        repositoryFactoryProvider(PropertiesTestEntityRepository),
        repositoryFactoryProvider(NestingTestEntityRepository)
    ]
})
export class TestModule {}
