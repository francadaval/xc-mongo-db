import { Logger, Type } from "@nestjs/common";

const logger = new Logger(Property.name);

const ENTITY_PROPERTIES = "entity:properties"

type PropertyDecoratorParameters = {
    propertyDBName?: string
    type?: Type<any>
};

export function Property(parameters?: PropertyDecoratorParameters) {
    return function (target: any, propertyKey: string) {
        let properties = Reflect.getOwnMetadata(ENTITY_PROPERTIES, target.constructor) || {};
        properties[propertyKey] = parameters || {};
        Reflect.defineMetadata(ENTITY_PROPERTIES, properties, target.constructor);

        logger.debug(`Property ${propertyKey} registered for ${target.constructor.name}.`)
    };
}
