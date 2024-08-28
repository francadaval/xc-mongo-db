/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { BaseEntity } from "@src/entity";
import { EntityProperties } from "./property.decorator";

const logger = new Logger(Entity.name);

export type EntityDecoratorParameters = {
    collectionName?: string
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<BaseEntity<unknown>>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, parameters || {}, target);
        const entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, target) || {};

        logger.debug(`${target.name} evaluated.`);

        const superPrototype = Object.getPrototypeOf(target.prototype);

        target.prototype.populate = function (data: any): void {
            superPrototype.populate.apply(this, [data]);
            for (const property in entityProperties) {
                this[property] = data[entityProperties[property].propertyDBName || property];
            }
        };

        target.prototype.serialize = function (): any {
            const serialized = superPrototype.serialize.apply(this);
            for (const property in entityProperties) {
                serialized[entityProperties[property].propertyDBName || property] = this[property];
            }
            return serialized;
        };
    };
}
