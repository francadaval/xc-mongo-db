import { ConfigurableModuleBuilder, Global, Module } from "@nestjs/common";
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
