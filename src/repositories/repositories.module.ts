import { Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import { MethodsBuilderProviders } from './builder/methods-builder-providers';
import { FindByBuilder, FindOneByBuilder } from "./builders";

@Module({
    providers: [
        RepositoryMethodsBuilder,
        ...MethodsBuilderProviders([
            FindByBuilder,
            FindOneByBuilder
        ])
    ],
    exports: [
        RepositoryMethodsBuilder
    ]
})
export class RepositoriesModule {}
