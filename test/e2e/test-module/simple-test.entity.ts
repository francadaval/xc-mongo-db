import { BaseDocEntity, Entity, Property } from "@src/entity";

@Entity()
export class SimpleTestEntity extends BaseDocEntity {
    @Property()
    name?: string;

    @Property()
    value?: number;

    @Property()
    tags: string[];

    @Property()
    date: Date;
}
