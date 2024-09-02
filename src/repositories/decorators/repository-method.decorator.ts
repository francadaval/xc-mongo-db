import { Logger } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";

const logger = new Logger(RepositoryMethod.name);

export function RepositoryMethod() {
    return function (target: object, propertyKey: string) { 
        const targetConstructor = target.constructor;

        const methods: string[] = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, targetConstructor) || [];
        methods.push(propertyKey);
        Reflect.defineMetadata(MetadataKeys.REPOSITORY_METHODS, methods, targetConstructor);
       
        logger.debug(`Method registered: ${targetConstructor.name}:${propertyKey}`);
    };
}
