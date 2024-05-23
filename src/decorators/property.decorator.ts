import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(Property.name);

export type EntityProperties = {
    [propertyName: string]: PropertyDecoratorParameters
}

export type PropertyDecoratorParameters = {
    propertyDBName?: string
    type?: Type<any>
};

export function Property(parameters?: PropertyDecoratorParameters) {
    return function (target: any, propertyKey: string) {
        let targetConstructor = target.constructor;

        let properties: PropertyDecoratorParameters = Reflect.getOwnMetadata(MetadataKeys.ENTITY_PROPERTIES, targetConstructor) || {};
        properties[propertyKey] = parameters || {};
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, properties, targetConstructor);

        logger.debug(`Property registered: ${targetConstructor.name}:${propertyKey}.`)
    };
}
