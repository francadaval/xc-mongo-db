import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

@Entity({
    collectionName: 'array_filter_test'
})
export class ArrayFilterTestEntity extends BaseDocEntity<string> {
    @Id()
    name: string;

    @Property()
    value?: number;

    @Property()
    list?: number[];
}
