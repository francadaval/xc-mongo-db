import { Logger } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";

const logger = new Logger(Repository.name);

export function Repository(db: string, collection: string) {
    return function (RepoType: any) {
        let methods = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
        logger.debug(`${RepoType.name} evaluated with ${methods.length} methods.`);
        
        return class extends RepoType {
            constructor(...args: any[]) {
                super(args[0], db, collection);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;
        
    };
}
