import { BaseEntity, Entity, Property } from "@src/entity";

@Entity()
export class NestedTestEntity extends BaseEntity {
    @Property()
    name?: string;
    
    @Property()
    value?: number;

    @Property()
    value2?: number;
}