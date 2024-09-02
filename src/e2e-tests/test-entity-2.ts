import { BaseDocEntity, Entity, Id, Property } from "../";

@Entity({
    collectionName: 'test_collection_2'
})
export class TestEntity2 extends BaseDocEntity<number>{
    @Id() entityId?: number;
    @Property() name?: string;
    @Property() value1?: number;
    @Property() value2?: number;
    @Property() date?: Date;
}
