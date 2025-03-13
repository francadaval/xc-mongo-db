import { Module } from "@nestjs/common";

import { RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";

import { TEST_URI } from "../../consts";
import { ArrayFilterTestRepository } from "./repositories/array-filter-test.repository";


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
        repositoryFactoryProvider(ArrayFilterTestRepository)
    ]
})
export class TestModule {}
