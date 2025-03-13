import { Abstract, DynamicModule } from "@nestjs/common";

import { BaseRepository, RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";
import { TEST_URI } from "./consts";
import { BaseDocEntity } from "@src/entity";

type RepositoryClass = Abstract<BaseRepository<BaseDocEntity<unknown>>>;

export function testModuleFactory(repositoryClasses: RepositoryClass[]): DynamicModule {
    class TestModule {};

    return {
        module: TestModule,
        imports: [
            RepositoriesModule.registerAsync({
                useFactory: () => {
                    return {
                        connectionUri: TEST_URI
                    };
                }
            })
        ],
        providers: repositoryClasses.map(repoClass => repositoryFactoryProvider(repoClass))
    };
}
