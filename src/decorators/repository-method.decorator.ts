import { Logger } from "@nestjs/common";

const logger = new Logger(RepositoryMethod.name);

const REPOSITORY_METHODS = 'repository:methods';

export function RepositoryMethod() {
    return function (target: Object, propertyKey: any, descriptor: PropertyDescriptor) {
        logger.debug(`Decorator called for ${target.constructor.name}:${propertyKey}`);

        let methods = Reflect.getOwnMetadata(REPOSITORY_METHODS, target) || [];
        methods.push(propertyKey);
        Reflect.defineMetadata(REPOSITORY_METHODS, [], target);

        descriptor.value = function() {
            this.logger.debug(`Repo function ${propertyKey} called with arguments: ${JSON.stringify(arguments)}`);
        }
    };
}
