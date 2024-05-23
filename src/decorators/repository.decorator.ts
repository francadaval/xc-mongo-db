import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "./metadata-keys";
import { buildRepositoryMethod } from "../repositories/builder/repo-method-builder";
import { EntityInterface } from "../entities";
import { EntityDecoratorParameters } from "./entity.decorator";
import { EntityProperties } from "./property.decorator";

const logger = new Logger(Repository.name);

export function Repository(db: string, entityType: Type<EntityInterface>) {
    return function (RepoType: any) {
        let methods = Reflect.getOwnMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
        let entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType)
        let entityParameters: EntityDecoratorParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, entityType);
        logger.debug(`${RepoType.name} evaluated with ${methods.length} methods.`);

        methods.forEach(method => {
            RepoType.prototype[method] = buildRepositoryMethod(method, entityProperties);
        });
        
        return class extends RepoType {
            constructor(...args: any[]) {
                // TODO: Get collection name
                super(args[0], db, entityParameters.collectionName || entityType.name);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;
    };
}
