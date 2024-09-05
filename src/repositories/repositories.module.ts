import { DynamicModule, Module } from "@nestjs/common";
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
import { MongoClientOptions } from "mongodb";

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

@Module({})
export class RepositoriesModule {
    static forRoot(connectionUri: string, options?: MongoClientOptions): DynamicModule {
        return {
            module: RepositoriesModule,
            providers: [
                {
                    provide: ConnectionService,
                    useValue: new ConnectionService(connectionUri, options)
                },
                RepositoryMethodsBuilder,
                ...MethodBuilderProviders(METHOD_BUILDERS),
                ...FilterModifierProviders(FILTER_MODIFIERS)
            ],
            exports: [
                RepositoryMethodsBuilder,
                ConnectionService
            ]
        }
    }
}
