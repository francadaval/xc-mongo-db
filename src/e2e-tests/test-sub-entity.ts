import { BaseEntity } from "../entity";
import { Entity, Property } from "../decorators";

@Entity()
export class TestSubEntity extends BaseEntity {
    @Property() value: number;
    @Property() name: string;
}
