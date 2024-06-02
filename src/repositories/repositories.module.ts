import { Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import { MethodBuilderProviders, CountByBuilder, FindAllByBuilder, FindOneByBuilder, FindPageByBuilder } from "./method-builders";
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
        ...MethodBuilderProviders(METHOD_BUILDERS),
        ...FilterModifierProviders(FILTER_MODIFIERS)
    ],
    exports: [
        RepositoryMethodsBuilder
    ]
})
export class RepositoriesModule {}
