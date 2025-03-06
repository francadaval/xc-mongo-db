import { BaseDocEntity, Entity, Property } from "@src/entity";

@Entity({
    collectionName: 'page_test'
})
export class PageTestEntity extends BaseDocEntity {
    @Property()
    name: string;

    @Property()
    value: number;
}