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
        const superPrototype = Object.getPrototypeOf(target.prototype);
        
        target.prototype.fromDoc = getFromDocFunction(superPrototype, entityProperties);
        target.prototype.toDoc = getToDocFunction(superPrototype, entityProperties);
        target.prototype.fromJson = getFromJsonFunction(superPrototype, entityProperties, idProperty);
        target.prototype.assignDefaultValues = getAssignDefaultValuesFunction(superPrototype, entityProperties);

        logger.log(`${target.name} entity, implementation completed.`);
    };
}

function getAssignDefaultValuesFunction(superPrototype: any, entityProperties: EntityProperties) {
    return function (): void {
        superPrototype.assignDefaultValues.apply(this);

        for (const property in entityProperties) {
            const parameters = entityProperties[property];
            if (parameters.default !== undefined && this[property] === undefined) {
                this[property] = parameters.default;
            }
        }
    }
}

function getFromDocFunction(superPrototype: any, entityProperties: EntityProperties) {
    return function(data: any): void {
        superPrototype.fromDoc.apply(this, [data]);
        for (const property in entityProperties) {
            const parameters = entityProperties[property];

            let value = data[parameters.dbProperty];

            this[property] = (parameters.type && value !== undefined)
                ? instantiateType(parameters.type, value)
                : value;
        }
    }
}

function instantiateType(type: Type<BaseEntity>, data: any, fromDoc = false): AnyDeepArray<BaseEntity>{
    return Array.isArray(data)
        ? data.map((item: any) => instantiateType(type, item))
        : new type(data, fromDoc);
}

function getToDocFunction(superPrototype: any, entityProperties: EntityProperties) {
    return function (): any {
        const doc = superPrototype.toDoc.apply(this);
        for (const property in entityProperties) {
            const parameters = entityProperties[property];
            const value = docProperty(this[property], parameters.type, parameters.password)
            if(value !== undefined) {
                doc[entityProperties[property].dbProperty] = value;
            }
        }
        return doc;
    }
}

function docProperty(value: any, type: Type<BaseEntity>, isPassword: boolean): any {
    return Array.isArray(value)
        ? value.map((item: any) => docProperty(item, type, isPassword))
        : docValue(value, isPassword);
}

function docValue(value: any, isPassword: boolean): any {
    let docValue = value instanceof BaseEntity ? value.toDoc() : value;
    docValue = docValue && isPassword ? hashedPassword(docValue) : docValue;
    return docValue;
}

function getFromJsonFunction(superPrototype: any, entityProperties: EntityProperties, idProperty: string) {
    return function (data: any): void {
        superPrototype.fromJson.apply(this, [data]);

        if (idProperty) {
            if (data[idProperty] !== undefined) {
                this[idProperty] = data[idProperty];
            } else {
                delete this[idProperty];
            }
        }

        for (const property in entityProperties) {
            const parameters = entityProperties[property];

            let value = data[property];

            if( value !== undefined ) {
                this[property] = parameters.type
                    ? instantiateType(parameters.type, value, true)
                    : value;
            }
        }

        Object.keys(data).filter(key => !entityProperties[key]).forEach(key => {
            this[key] = data[key];
        });
    }
}

function hashedPassword(password: string): string {
    if(!password || !(typeof(password) === 'string')) {
        logger.error('Password is not a string.');
        return password;
    }

    return hashSync(password, 10);
}
