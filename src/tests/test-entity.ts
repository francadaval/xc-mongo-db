import { Entity, Property } from "../decorators";
import { EntityInterface } from "../entities";
import { TestSubEntity } from "./test-sub-entity";

@Entity()
export class TestEntity implements EntityInterface {
    @Property() _id?: string;
    @Property() name?: string;
    @Property() value?: number;
    @Property() lockAndStock?: number
    @Property() date?: Date;
    @Property({ type: TestSubEntity}) subEntity: TestSubEntity
}
