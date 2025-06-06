import { BaseDocEntity, Entity, Property } from "@src/entity";

@Entity({
    collectionName: 'base_test'
})
export class BaseTestEntity extends BaseDocEntity {
    @Property()
    name?: string;

    @Property()
    value?: number;

    @Property()
    tags?: string[];

    @Property()
    date?: Date;

    noStored: string;
}
