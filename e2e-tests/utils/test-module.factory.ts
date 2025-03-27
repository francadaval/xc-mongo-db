import { Abstract, DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseRepository, RepositoriesModule, repositoryFactoryProvider } from "@src/repositories";
import { BaseDocEntity } from "@src/entity";

type RepositoryClass = Abstract<BaseRepository<BaseDocEntity<unknown>>>;

export function testModuleFactory(repositoryClasses: RepositoryClass[]): DynamicModule {
    class TestModule {};

    return {
        module: TestModule,
        imports: [
            ConfigModule.forRoot({
                isGlobal: true
            }),
            RepositoriesModule.registerAsync({
                useFactory: (configService: ConfigService) => ({
                        connectionUri: configService.get('E2E_TEST_MONGO_URI')
                }),
                inject: [ConfigService]
            })
        ],
        providers: repositoryClasses.map(repoClass => repositoryFactoryProvider(repoClass))
    };
}
