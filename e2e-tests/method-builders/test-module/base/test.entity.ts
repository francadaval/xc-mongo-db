import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

@Entity({
    collectionName: 'method_builders_test'
})
export class TestEntity extends BaseDocEntity<string> {
    @Id()
    name: string;

    @Property()
    value1?: number;

    @Property({
        dbProperty: 'value_2',
    })
    value2?: number;
}