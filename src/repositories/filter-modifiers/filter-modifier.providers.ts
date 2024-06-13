import { RepositoryMethodsBuilder } from "../builder/repo-method-builder";
import { FilterModifier } from "./filter-modifier";

import { FactoryProvider, Type } from "@nestjs/common";

export const FilterModifierProviders = (builderTypes: Type<FilterModifier>[]) => {
    return builderTypes.map(type => createFactoryProvider(type));
};

function createFactoryProvider(type: Type<FilterModifier>): FactoryProvider {
    return {
        provide: type,
        useFactory: (methodsBuilder: RepositoryMethodsBuilder) => createModifier(type, methodsBuilder),
        inject: [RepositoryMethodsBuilder]
    }
}

function createModifier(type: Type<FilterModifier>, methodsBuilder: RepositoryMethodsBuilder): FilterModifier {
    const modifier = new type();
    methodsBuilder.registerModifier(modifier);
    return modifier;
}
