import { Entity, Property } from "../decorators";
import { EntityInterface } from "../entities";

@Entity()
export class BaseEntity implements EntityInterface {
    @Property() _id?: string;
    @Property() name?: string;
    @Property() value?: number;
}
