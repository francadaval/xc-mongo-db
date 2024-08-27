import { BaseEntity } from "../entity";
import { Entity, Property } from "../decorators";

@Entity({
    collectionName: 'test_collection_2'
})
export class TestEntity2 extends BaseEntity<any>{
    @Property() name?: string;
    @Property() value1?: number;
    @Property() value2?: number;
    @Property() date?: Date;
}
