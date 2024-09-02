import { Logger } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";

const logger = new Logger(Id.name);

export function Id() {
    return function (target: object, propertyKey: string) {
        const targetConstructor = target.constructor;

        if (Reflect.hasMetadata(MetadataKeys.ID_PROPERTY, targetConstructor)) {
            const idProperty = Reflect.getMetadata(MetadataKeys.ID_PROPERTY, targetConstructor);
            const message = `Id already registered: ${targetConstructor.name}:${idProperty}.`;
            logger.error(message);
            throw new Error(message);
        }

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

        logger.debug(`Id registered: ${targetConstructor.name}:${propertyKey}.`)
    };
}