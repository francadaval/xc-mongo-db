import { RepositoryMethodsBuilder } from "../builder/repo-method-builder";
import { MethodBuilder } from "./method-builder";

import { FactoryProvider, Type } from "@nestjs/common";

export const MethodBuilderProviders = (builderTypes: Type<MethodBuilder>[]) => {
    return builderTypes.map(type => createFactoryProvider(type));
};

function createFactoryProvider(type: Type<MethodBuilder>): FactoryProvider {
    return {
        provide: type,
        useFactory: (methodsBuilder: RepositoryMethodsBuilder) => createBuilder(type, methodsBuilder),
        inject: [RepositoryMethodsBuilder]
    }
}

function createBuilder(type: Type<MethodBuilder>, methodsBuilder: RepositoryMethodsBuilder): MethodBuilder {
    const builder = new type();
    methodsBuilder.registerBuilder(builder);
    return builder;
}
