import { Logger, PipeTransform, Type } from "@nestjs/common";
import { BaseEntity } from "@src/entity";

export class EntityPipe implements PipeTransform {
    private entityType: Type<BaseEntity>;
    private static logger = new Logger(EntityPipe.name);

    constructor(entityType: Type<BaseEntity>) {
        this.entityType = entityType;
    }

    transform(value: any): BaseEntity {
        EntityPipe.logger.debug(`Transforming ${JSON.stringify(value)} to ${this.entityType.name}`);
        return new this.entityType(value, false);
    }
}
