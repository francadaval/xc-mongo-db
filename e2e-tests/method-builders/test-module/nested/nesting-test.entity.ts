import { BaseDocEntity, Entity, Property } from "@src/entity";

import { NestedTestEntity as NestedEntity } from "./nested.entity";

@Entity({
    collectionName: 'method_builder_nesting_test'
})
export class NestingTestEntity extends BaseDocEntity {
    @Property()
    name: string;

    @Property()
    nestedValue2: number;

    @Property({
        type: NestedEntity
    })
    nested?: NestedEntity;
}
