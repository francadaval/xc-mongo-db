import { Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import { MethodsBuilderProviders, CountByBuilder, FindAllByBuilder, FindOneByBuilder, FindPageByBuilder } from "./method-builders";
import { GreaterThanModifier, FilterModifierProviders } from "./filter-modifiers";

const METHOD_BUILDERS = [
    CountByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder
];

const FILTER_MODIFIERS = [
    GreaterThanModifier
]

@Module({
    providers: [
        RepositoryMethodsBuilder,
        ...MethodsBuilderProviders(METHOD_BUILDERS),
        ...FilterModifierProviders(FILTER_MODIFIERS)
    ],
    exports: [
        RepositoryMethodsBuilder
    ]
})
export class RepositoriesModule {}
