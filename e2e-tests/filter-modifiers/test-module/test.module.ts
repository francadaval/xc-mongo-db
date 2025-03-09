import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../../consts";
import { BetweenTestRepository } from "./base/between-test.repository";

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
        repositoryFactoryProvider(BetweenTestRepository)
    ]
})
export class TestModule {}
