import { BaseDocEntity, Entity, Property } from "@src/entity";

import { BaseTestEntity } from "../base/base-test.entity";
import { NestedTestEntity } from "./nested-test.entity";

@Entity({
    collectionName: 'nesting_test'
})
export class NestingTestEntity extends BaseDocEntity {
    @Property()
    name?: string;

    @Property()
    value?: number;

    @Property({
        type: NestedTestEntity
    })
    nested?: NestedTestEntity;
}