import { Logger, Type } from "@nestjs/common";

const logger = new Logger(Entity.name);

const ENTITY_PROPERTIES = "entity:properties"

type EntityDecoratorParameters = {
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<any>) {
        let properties = Reflect.getMetadata(ENTITY_PROPERTIES, target) || {};
        let numberOfProperties = Object.getOwnPropertyNames(properties).length;

        logger.debug(`${target.name} evaluated with ${numberOfProperties} properties.`)
    };
}
