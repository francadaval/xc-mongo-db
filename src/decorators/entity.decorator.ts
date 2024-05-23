import { Logger, Type } from "@nestjs/common";
import { EntityInterface } from "src/entities";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(Entity.name);

export type EntityDecoratorParameters = {
    collectionName?: string
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<EntityInterface>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, parameters || {}, target);
        let properties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, target) || {};
        let numberOfProperties = Object.getOwnPropertyNames(properties).length;

        logger.debug(`${target.name} evaluated with ${numberOfProperties} properties.`)
    };
}
