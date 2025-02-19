import { BaseDocEntity, Entity, Property } from "../";
import { TestSubEntity } from "./test-sub-entity";

@Entity()
export class TestEntity extends BaseDocEntity {
    @Property({unique: true})
    name?: string;
    @Property() value?: number;
    @Property() lockAndStock?: number
    @Property() date?: Date;
    @Property({ type: TestSubEntity}) subEntity: Partial<TestSubEntity>
}
