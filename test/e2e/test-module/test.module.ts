import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { SimpleTestEntityRepository } from "./simple-test-entity.repository";
import { TEST_URI } from "../consts";
import { PropertiesTestEntityRepository } from "./properties-test-entity.repository";

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
        repositoryFactoryProvider(SimpleTestEntityRepository),
        repositoryFactoryProvider(PropertiesTestEntityRepository)
    ]
})
export class TestModule {}
