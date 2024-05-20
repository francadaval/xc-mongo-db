import { Abstract, Logger } from "@nestjs/common";

const logger = new Logger(Repository.name);

export function Repository(db: string, collection: string) {
        logger.debug("Factory evaluated");
    return function (abstract: Abstract<any>) {
        logger.debug(`Decorator called for ${abstract.name}.`);
        abstract.prototype.connectionParams = {
            db, collection
        }
    };
}
