import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { Document } from "mongodb";

const logger = new Logger(Entity.name);

export type EntityDecoratorParameters = {
    collectionName?: string
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<Document>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, parameters || {}, target);

        logger.debug(`${target.name} evaluated.`)
    };
}
