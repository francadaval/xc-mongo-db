import { Entity, Property } from "../decorators";
import { BaseTestEntity } from "./base-test-entity";

@Entity()
export class ExtendedEntity extends BaseTestEntity {
    @Property({
        propertyDBName: 'extended'
    }) extendedProperty: string;
}
