import { Entity, Property } from "../decorators";
import { TestSubEntity } from "./test-sub-entity";

@Entity()
export class TestEntity {
    @Property() name?: string;
    @Property() value?: number;
    @Property() lockAndStock?: number
    @Property() date?: Date;
    @Property({ type: TestSubEntity}) subEntity: TestSubEntity
}
