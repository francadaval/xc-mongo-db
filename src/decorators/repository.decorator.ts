import { Logger } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { buildRepositoryMethod } from "../repositories/builder/repo-method-builder";

const logger = new Logger(Repository.name);

export function Repository(db: string, collection: string) {
    return function (RepoType: any) {
        let methods = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
        logger.debug(`${RepoType.name} evaluated with ${methods.length} methods.`);

        methods.forEach(method => {
            RepoType.prototype[method] = buildRepositoryMethod(method);
        });
        
        return class extends RepoType {
            constructor(...args: any[]) {
                super(args[0], db, collection);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;
    };
}
