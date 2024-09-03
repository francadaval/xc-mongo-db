import { Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import {
    MethodBuilderProviders,
    CountByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder,
    DeleteAllByBuilder
} from "./method-builders";
import {
    GreaterThanModifier,
    FilterModifierProviders,
    GreaterThanEqualModifier,
    BetweenModifier,
    LessThanEqualModifier,
    LessThanModifier
} from "./filter-modifiers";
import { ConnectionService } from "../connection";

const METHOD_BUILDERS = [
    CountByBuilder,
    DeleteAllByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder
];

const FILTER_MODIFIERS = [
    BetweenModifier,
    GreaterThanEqualModifier,
    GreaterThanModifier,
    LessThanEqualModifier,
    LessThanModifier
]

@Module({
    providers: [
        ConnectionService,
        RepositoryMethodsBuilder,
        ...MethodBuilderProviders(METHOD_BUILDERS),
        ...FilterModifierProviders(FILTER_MODIFIERS)
    ],
    exports: [
        RepositoryMethodsBuilder,
        ConnectionService
    ]
})
export class RepositoriesModule {}
