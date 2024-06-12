import { Entity, Property } from "../decorators";
import { BaseEntity } from "./base-entity";

@Entity()
export class ExtendedEntity extends BaseEntity {
    @Property({
        propertyDBName: 'extended'
    }) extendedProperty: string;
}
