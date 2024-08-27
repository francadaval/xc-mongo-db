import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { BaseEntity } from "@src/entity";

const logger = new Logger(Entity.name);

export type EntityDecoratorParameters = {
    collectionName?: string
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<BaseEntity<unknown>>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, parameters || {}, target);

        logger.debug(`${target.name} evaluated.`)
    };
}
