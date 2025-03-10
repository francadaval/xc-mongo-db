import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../../consts";
import { BetweenTestRepository } from "./repositories/between-test.repository";
import { GreaterThanEqualTestRepository } from "./repositories/greater-than-equal-test.repository";
import { GreaterThanTestRepository } from "./repositories/greater-than-test.repository";
import { LessThanEqualTestRepository } from "./repositories/less-than-equal-test.repository";
import { LessThanTestRepository } from "./repositories/less-than-test.repository";

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
        repositoryFactoryProvider(BetweenTestRepository),
        repositoryFactoryProvider(GreaterThanEqualTestRepository),
        repositoryFactoryProvider(GreaterThanTestRepository),
        repositoryFactoryProvider(LessThanEqualTestRepository),
        repositoryFactoryProvider(LessThanTestRepository)
    ]
})
export class TestModule {}
