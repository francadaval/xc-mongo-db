import { Entity, Property } from "../decorators";
import { EntityInterface } from "../entities";

@Entity()
export class TestEntity2 implements EntityInterface {
    @Property() _id?: any;
    @Property() name?: string;
    @Property() value1?: number;
    @Property() value2?: number;
    @Property() date?: Date;
}
