/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { BaseEntity } from "../entity";
import { EntityProperties } from "./property.decorator";

const logger = new Logger(Entity.name);

export type EntityDecoratorParameters = {
    collectionName?: string
};

export function Entity(parameters?: EntityDecoratorParameters) {
    return function (target: Type<BaseEntity>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, parameters || {}, target);
        const entityProperties: EntityProperties = Reflect.getOwnMetadata(MetadataKeys.ENTITY_PROPERTIES, target) || {};
        const idProperty: string = Reflect.getOwnMetadata(MetadataKeys.ID_PROPERTY, target);

        logger.debug(`${target.name} evaluated.`);

        const superPrototype = Object.getPrototypeOf(target.prototype);

        target.prototype.populate = function (data: any): void {
            superPrototype.populate.apply(this, [data]);
            for (const property in entityProperties) {
                const parameters = entityProperties[property];
                const value = data[parameters.dbProperty];

                this[property] = (parameters.type && value !== undefined) ? new parameters.type(value) : value;
            }
        };

        target.prototype.serialize = function (): any {
            const serialized = superPrototype.serialize.apply(this);
            for (const property in entityProperties) {
                const parameters = entityProperties[property];
                const value = parameters.type && this[property] instanceof BaseEntity
                    ? this[property].serialize()
                    : this[property];
                serialized[entityProperties[property].dbProperty] = value;
            }
            return serialized;
        };

        target.prototype.deserialize = function (data: any): void {
            superPrototype.deserialize.apply(this, [data]);

            if (idProperty) {
                this[idProperty] = data[idProperty];
            }

            for (const property in entityProperties) {
                const parameters = entityProperties[property];
                const value = data[property];

                this[property] = (parameters.type && value !== undefined) ? new parameters.type(value, false) : value;
            }
        }
    };
}
