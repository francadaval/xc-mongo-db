import { Logger, Type } from "@nestjs/common";
import { IndexDirection } from "mongodb";

import { MetadataKeys } from "../../common/metadata-keys";
import { BaseEntity } from "../base-entity";

const logger = new Logger(Property.name);

export type EntityProperties = {
    [propertyName: string]: PropertyParameters<unknown>
}

export type PropertyDecoratorParameters<T> = {
    dbProperty?: string
    unique?: boolean
    password?: boolean
    default?: T
    index?: IndexDirection,
    type?: Type
};

export type PropertyParameters<T> = PropertyDecoratorParameters<T> & {
    designType: Type
}

export function Property(parameters: PropertyDecoratorParameters<unknown> = {}) {
    return function (target: object, propertyKey: string) {
        parameters.dbProperty = parameters.dbProperty || propertyKey;
        
        const targetConstructor = target.constructor;
        const properties: EntityProperties = {...(Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, targetConstructor) || {})};

        checkDbProperty(properties, propertyKey, parameters, targetConstructor.name);
        checkPropertyIsNotId(targetConstructor, propertyKey);
        checkParameters(parameters, targetConstructor.name, propertyKey);

        const designType = Reflect.getMetadata("design:type", target, propertyKey);
        checkPropertyDesignType(designType, targetConstructor.name, propertyKey);
        properties[propertyKey] = {...parameters, designType };

        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, properties, targetConstructor);
        logger.debug(`${targetConstructor.name}:${propertyKey}: Property registered, designType: ${designType.name}, type: ${parameters.type?.name}.`)
    };
}

function checkDbProperty(
    properties: EntityProperties,
    propertyKey: string,
    parameters: PropertyDecoratorParameters<unknown>,
    targetConstructorName: string
) {
    const filterResult = Object.values(properties).filter(prop => prop.dbProperty === parameters.dbProperty);
    if (filterResult.length > 0) {
        throwError(`${targetConstructorName}:${propertyKey}: Property with dbProperty '${parameters.dbProperty}' already exists.`);
    }
}

function checkPropertyIsNotId(targetConstructor: Function, propertyKey: string) {
    const idProperty = Reflect.getMetadata(MetadataKeys.ID_PROPERTY, targetConstructor);
    if(idProperty === propertyKey) {
        throwError(`@Id decorator cannot be applied with @PropertyDecorator ${targetConstructor.name}:${propertyKey}.`);
    }
}

function checkParameters(parameters: PropertyDecoratorParameters<unknown>, targetConstructorName: string, propertyKey: string) {
    const TARGET_NAME = `${targetConstructorName}:${propertyKey}`;

    if(parameters.password && parameters.unique) {
        throwError(`${TARGET_NAME}: Property with both password and unique set to true.`);
    }

    if(parameters.password && parameters.default !== undefined) {
        throwError(`${TARGET_NAME}: Property with both password and default set.`);
    }

    if(parameters.unique && parameters.default !== undefined) {
        throwError(`${TARGET_NAME}: Property with both unique and default set.`);
    }
}

// TODO: Improve type checking, add missing types
// In case of arrays, the designType will be Array but the actual type of elements will be unknown.
function checkPropertyDesignType(designType: Type, targetConstructorName: string, propertyKey: string) {
    const basicTypes: Type[] = [String, Number, Boolean, Date, Array];
    if (!(basicTypes.includes(designType) || designType.prototype instanceof BaseEntity)) {
        logger.warn(`${targetConstructorName}:${propertyKey}: Property type ${designType} may be not supported.`);
    }
}

function throwError(message: string) {
    logger.error(message);
    throw new Error(message);
}
