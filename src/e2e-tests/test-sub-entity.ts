import { BaseEntity, Entity, Property  } from "../";

@Entity()
export class TestSubEntity extends BaseEntity {
    @Property() value: number;
    @Property() name: string;
}
