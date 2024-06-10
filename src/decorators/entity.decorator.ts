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

        logger.debug(`${target.name} evaluated.`)
    };
}
