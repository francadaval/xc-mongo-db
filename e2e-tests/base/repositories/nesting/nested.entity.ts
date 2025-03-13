import { BaseEntity, Entity, Property } from "@src/entity";

@Entity()
export class NestedTestEntity extends BaseEntity {
    @Property()
    value?: number;

    @Property()
    name?: string;
}