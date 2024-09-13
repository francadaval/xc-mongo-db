import { Module } from "@nestjs/common";
import { RepositoriesModule, repositoryFactoryProvider } from "../";
import { TestRepo } from "./test-repo";
import { TestRepo2 } from "./test-repo-2";
import { ExtendedEntityRepository } from "./extended-entity-repo";

const TEST_URI = "mongodb://root:epdsrntrMDB@localhost:27017";

@Module({
    imports: [
        RepositoriesModule.registerAsync({
            useFactory: () => {
                return {
                    connectionUri: TEST_URI
                };
            }
        })
//        RepositoriesModule.register({
//            connectionUri: TEST_URI
//        })
    ],
    providers: [
        repositoryFactoryProvider(TestRepo),
        repositoryFactoryProvider(TestRepo2),
        repositoryFactoryProvider(ExtendedEntityRepository)
    ]
})
export class TestModule {}
