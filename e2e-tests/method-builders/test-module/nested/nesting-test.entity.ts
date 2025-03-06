import { BaseDocEntity, Entity, Property } from "@src/entity";

import { NestedTestEntity } from "./nested-test.entity";

@Entity({
    collectionName: 'nesting_test'
})
export class NestingTestEntity extends BaseDocEntity {
    @Property()
    name: string;

    @Property()
    nestedValue2: number;

    @Property({
        type: NestedTestEntity
    })
    nested?: NestedTestEntity;
}