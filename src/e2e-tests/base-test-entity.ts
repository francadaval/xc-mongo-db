import { BaseDocEntity } from "../entity";
import { Entity, Property } from "../decorators";

@Entity()
export class BaseTestEntity extends BaseDocEntity<string>{
    @Property() name?: string;
    @Property() value?: number;
}
