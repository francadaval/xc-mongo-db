import { Logger } from "@nestjs/common";

const logger = new Logger(RepositoryMethod.name);

export function RepositoryMethod() {
        logger.debug("Factory evaluated");
    return function (target: Object, propertyKey: any, descriptor: PropertyDescriptor) {
        logger.debug(`Decorator called for ${propertyKey}`);
        descriptor.value = function() {
            logger.debug(`Repo function ${propertyKey} called with arguments: ${JSON.stringify(arguments)}`);
            logger.debug("Instance atribute: " + this.test_att);
        }
    };
}
