import { Logger } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(RepositoryMethod.name);

export function RepositoryMethod() {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) { 
        let targetConstructor = target.constructor;

        let methods: string[] = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, targetConstructor) || [];
        methods.push(propertyKey);
        Reflect.defineMetadata(MetadataKeys.REPOSITORY_METHODS, methods, targetConstructor);
       
        logger.debug(`Method registered: ${targetConstructor.name}:${propertyKey}`);
    };
}
