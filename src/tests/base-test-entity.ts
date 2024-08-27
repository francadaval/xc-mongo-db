import { BaseEntity } from "../entity";
import { Entity, Property } from "../decorators";

@Entity()
export class BaseTestEntity extends BaseEntity<string>{
    @Property() name?: string;
    @Property() value?: number;
}
