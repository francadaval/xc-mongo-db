import { FactoryProvider, Type } from "@nestjs/common";
import { RepositoryMethodsBuilder } from "./repo-method-builder";
import { MethodBuilder } from "../method-builders/method-builder";

export const MethodsBuilderProviders = (builderTypes: Type<MethodBuilder>[]) => {
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
    let builder = new type();
    methodsBuilder.registerBuilder(builder);
    return builder;
}
