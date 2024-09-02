import { Entity, Property } from "../";
import { BaseTestEntity } from "./base-test-entity";

@Entity()
export class ExtendedEntity extends BaseTestEntity {
    @Property({
        dbProperty: 'extended'
    }) extendedProperty: string;
}
