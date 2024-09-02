/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";
import { BaseEntity } from "../base-entity";
import { EntityProperties } from "./property.decorator";
import { hashSync } from "bcrypt";

type AnyDeepArray<T> = T | T[] | AnyDeepArray<T>[];

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

        target.prototype.populate = getPopulateFunction(superPrototype, entityProperties);

        target.prototype.serialize = getSerializeFunction(superPrototype, entityProperties);

        target.prototype.deserialize = getDeserializeFunction(superPrototype, entityProperties, idProperty);
    };
}

function getPopulateFunction(superPrototype: any, entityProperties: EntityProperties) {
    return function(data: any): void {
        superPrototype.populate.apply(this, [data]);
        for (const property in entityProperties) {
            const parameters = entityProperties[property];
            const value = data[parameters.dbProperty];

            if (parameters.password) {
                delete this[property];
            } else {
                this[property] = (parameters.type && value !== undefined)
                    ? instantiateType(parameters.type, value)
                    : value;
            }
        }
    }
}

function instantiateType(type: Type<BaseEntity>, data: any, fromDb = false): AnyDeepArray<BaseEntity>{
    return Array.isArray(data)
        ? data.map((item: any) => instantiateType(type, item))
        : new type(data, fromDb);
}

function getSerializeFunction(superPrototype: any, entityProperties: EntityProperties) {
    return function (): any {
        const serialized = superPrototype.serialize.apply(this);
        for (const property in entityProperties) {
            const parameters = entityProperties[property];
            const value = serializeProperty(this[property], parameters.type, parameters.password)
            serialized[entityProperties[property].dbProperty] = value;
        }
        return serialized;
    }
}

function serializeProperty(value: any, type: Type<BaseEntity>, isPassword: boolean): any {
    return Array.isArray(value)
        ? value.map((item: any) => serializeProperty(item, type, isPassword))
        : serializedValue(value, isPassword);
}

function serializedValue(value: any, isPassword: boolean): any {
    let serializedValue = value instanceof BaseEntity ? value.serialize() : value;
    serializedValue = serializedValue && isPassword ? hashedPassword(serializedValue) : serializedValue;
    return serializedValue;
}

function getDeserializeFunction(superPrototype: any, entityProperties: EntityProperties, idProperty: string) {
    return function (data: any): void {
        superPrototype.deserialize.apply(this, [data]);

        if (idProperty) {
            this[idProperty] = data[idProperty];
        }

        for (const property in entityProperties) {
            const parameters = entityProperties[property];
            const value = data[property];

            this[property] = (parameters.type && value !== undefined)
                ? instantiateType(parameters.type, value, true)
                : value;
        }
    }
}

function hashedPassword(password: string): string {
    if(!password || !(typeof(password) === 'string')) {
        logger.error('Password is not a string.');
        return password;
    }

    return hashSync(password, 10);
}
