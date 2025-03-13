import { BaseDocEntity, Entity, Property } from "@src/entity";

import { NestedTestEntity as NestedEntity } from "./nested.entity";

@Entity({
    collectionName: 'base_nesting_test'
})
export class NestingTestEntity extends BaseDocEntity {
    @Property()
    name?: string;

    @Property()
    value?: number;

    @Property({
        type: NestedEntity
    })
    nested?: NestedEntity;
}