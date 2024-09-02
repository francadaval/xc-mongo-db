import { BaseDocEntity, Entity, Property } from "../";

@Entity()
export class BaseTestEntity extends BaseDocEntity<string>{
    @Property() name?: string;
    @Property() value?: number;
}
