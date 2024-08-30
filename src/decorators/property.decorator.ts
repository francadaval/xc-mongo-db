import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(Property.name);

export type EntityProperties = {
    [propertyName: string]: PropertyDecoratorParameters
}

export type PropertyDecoratorParameters = {
    dbProperty?: string
    type?: Type
    unique?: boolean
};

export function Property(parameters: PropertyDecoratorParameters = {}) {
    return function (target: object, propertyKey: string) {
        parameters.dbProperty = parameters.dbProperty || propertyKey;
        
        const targetConstructor = target.constructor;
        const properties: EntityProperties = {...Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, targetConstructor)} || {};
        properties[propertyKey] = parameters;

        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, properties, targetConstructor);

        logger.debug(`Property registered: ${targetConstructor.name}:${propertyKey}.`)
    };
}
