import { ConfigurableModuleBuilder, Global, Module } from "@nestjs/common";
import { RepositoryMethodsBuilder } from './builder/repo-method-builder';
import {
    MethodBuilderProviders,
    CountByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder,
    DeleteAllByBuilder,
    UpdateByBuilder
} from "./method-builders";
import {
    BetweenModifier,
    FilterModifierProviders,
    GreaterThanModifier,
    GreaterThanEqualModifier,
    InModifier,
    LessThanEqualModifier,
    LessThanModifier,
    MatchAllModifier
} from "./filter-modifiers";
import { ConnectionService } from "../connection";
import { MongoClientOptions } from "mongodb";

const METHOD_BUILDERS = [
    CountByBuilder,
    DeleteAllByBuilder,
    FindAllByBuilder,
    FindOneByBuilder,
    FindPageByBuilder,
    UpdateByBuilder
];

const FILTER_MODIFIERS = [
    BetweenModifier,
    GreaterThanModifier,
    GreaterThanEqualModifier,
    InModifier,
    LessThanEqualModifier,
    LessThanModifier,
    MatchAllModifier
]

export interface RepositoriesModuleOptions {
    connectionUri: string;
    mongoClientOptions?: MongoClientOptions;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<RepositoriesModuleOptions>().build();

@Global()
@Module({
    providers: [
        RepositoryMethodsBuilder,
        ...MethodBuilderProviders(METHOD_BUILDERS),
        ...FilterModifierProviders(FILTER_MODIFIERS),
        {                    
            provide: ConnectionService,
            useFactory: (options: RepositoriesModuleOptions) => 
                new ConnectionService(options.connectionUri, options.mongoClientOptions),
            inject: [MODULE_OPTIONS_TOKEN],
        }
    ],
    exports: [
        RepositoryMethodsBuilder,
        ConnectionService
    ]
})
export class RepositoriesModule extends ConfigurableModuleClass {}
