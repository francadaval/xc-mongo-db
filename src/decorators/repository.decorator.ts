import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { EntityInterface } from "../entities";
import { EntityDecoratorParameters } from "./entity.decorator";

const logger = new Logger(Repository.name);

export function Repository(db: string, entityType: Type<EntityInterface>) {
    return function (RepoType: any) {
        const methods = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType) || [];
        const entityParameters: EntityDecoratorParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, entityType);
        Reflect.defineMetadata(MetadataKeys.ENTITY_TYPE, entityType, RepoType);
        logger.debug(`${RepoType.name} evaluated with ${methods.length} methods.`);

        return class extends RepoType {
            constructor(...args: any[]) {
                super(args[0], db, entityParameters.collectionName || entityType.name);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;
    };
}
