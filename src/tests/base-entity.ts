import { Entity, Property } from "../decorators";

@Entity()
export class BaseEntity {
    @Property() _id?: string;
    @Property() name?: string;
    @Property() value?: number;
}
