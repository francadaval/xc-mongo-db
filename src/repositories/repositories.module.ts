import { Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import { MethodsBuilderProviders } from './builder/methods-builder-providers';
import { CountByBuilder, FindAllByBuilder, FindOneByBuilder, FindPageByBuilder } from "./method-builders";

const METHOD_BUILDERS = [
    CountByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder
];

@Module({
    providers: [
        RepositoryMethodsBuilder,
        ...MethodsBuilderProviders(METHOD_BUILDERS)
    ],
    exports: [
        RepositoryMethodsBuilder
    ]
})
export class RepositoriesModule {}
