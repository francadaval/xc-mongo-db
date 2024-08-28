import { BaseEntity } from "../entity";
import { Entity, Property } from "../decorators";
import { TestSubEntity } from "./test-sub-entity";

@Entity()
export class TestEntity extends BaseEntity {
    @Property({unique: true})
    name?: string;
    @Property() value?: number;
    @Property() lockAndStock?: number
    @Property() date?: Date;
    @Property({ type: TestSubEntity}) subEntity: TestSubEntity
}
