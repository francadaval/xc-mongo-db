import { Logger } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";

const logger = new Logger(Id.name);

export function Id() {
    return function (target: object, propertyKey: string) {
        const targetConstructor = target.constructor;

        checkIdDoesntExist(targetConstructor, propertyKey);
        checkIdIsNotProperty(targetConstructor, propertyKey);

        Reflect.defineMetadata(MetadataKeys.ID_PROPERTY, propertyKey, targetConstructor);

        Object.defineProperty(targetConstructor.prototype, '_id', {
            get: function () {
                return this[propertyKey];
            },
            set: function (value) {
                if(value !== undefined) {
                    this[propertyKey] = value;
                } else {
                    delete this[propertyKey];
                }
            }
        });

        logger.debug(`${targetConstructor.name}:${propertyKey}: Id registered.`)
    };
}

function checkIdDoesntExist(targetConstructor: Function, propertyKey: string) {
    const idProperty = Reflect.getMetadata(MetadataKeys.ID_PROPERTY, targetConstructor);
    if (idProperty) {
        const message = `${targetConstructor.name}:${propertyKey} - Id already registered: ${targetConstructor.name}:${idProperty}.`;
        logger.error(message);
        throw new Error(message);
    }
}

function checkIdIsNotProperty(targetConstructor: Function, propertyKey: string) {
    const properties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, targetConstructor) || {};
    if (properties[propertyKey]) {
        const message = `${targetConstructor.name}:${propertyKey} - @Id cannot be applied with @Property decorator.`;
        logger.error(message);
        throw new Error(message);
    }
}
