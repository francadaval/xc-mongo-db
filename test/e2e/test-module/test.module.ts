import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { BaseTestEntityRepository } from "./base/base-test-entity.repository";
import { TEST_URI } from "../consts";
import { PropertiesTestEntityRepository } from "./properties/properties-test-entity.repository";

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
        repositoryFactoryProvider(PropertiesTestEntityRepository)
    ]
})
export class TestModule {}
