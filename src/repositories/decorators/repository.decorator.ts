import { Logger, Type } from "@nestjs/common";
import { MetadataKeys } from "../../common/metadata-keys";
import { BaseDocEntity, EntityDecoratorParameters } from "../../entity";
import { BaseRepository } from "../base-repository";

const logger = new Logger(Repository.name);

export function Repository(db: string, entityType: Type<BaseDocEntity<unknown>>) {
    return function (target: Type<BaseRepository<BaseDocEntity<unknown>>>) {
        Reflect.defineMetadata(MetadataKeys.ENTITY_TYPE, entityType, target);
        
        const entityParameters: EntityDecoratorParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, entityType);
        
        const newClass =  class extends target {
            constructor(...args: any[]) {
                super(args[0], db, entityParameters.collectionName || entityType.name);
                this.logger = new Logger(target.name);
            }
        } as typeof target;

        logger.log(`${target.name}, class created.`);

        return newClass;
    };
}
