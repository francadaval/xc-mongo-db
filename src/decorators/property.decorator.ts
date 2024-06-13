import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(Property.name);

export type EntityProperties = {
    [propertyName: string]: PropertyDecoratorParameters
}

export type PropertyDecoratorParameters = {
    propertyDBName?: string
    type?: Type
};

export function Property(parameters?: PropertyDecoratorParameters) {
    return function (target: object, propertyKey: string) {
        const targetConstructor = target.constructor;

        const properties: PropertyDecoratorParameters = {...Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, targetConstructor)} || {};
        properties[propertyKey] = parameters || {};
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, properties, targetConstructor);

        logger.debug(`Property registered: ${targetConstructor.name}:${propertyKey}.`)
    };
}
