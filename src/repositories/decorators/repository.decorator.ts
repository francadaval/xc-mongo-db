import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";
import { BaseDocEntity, EntityDecoratorParameters } from "../../entity";

const logger = new Logger(Repository.name);

export function Repository(db: string, entityType: Type<BaseDocEntity<unknown>>) {
    // TODO: Find typing for this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (RepoType: any) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_TYPE, entityType, RepoType);
        
        const entityParameters: EntityDecoratorParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, entityType);
        
        const newClass =  class extends RepoType {
            constructor(...args: any[]) {
                super(args[0], db, entityParameters.collectionName || entityType.name);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;

        logger.log(`${RepoType.name}, class created.`);

        return newClass;
    };
}
