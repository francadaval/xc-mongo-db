import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

export const VALUE_DEFAULT = 101;

@Entity({
    collectionName: 'properties_test'
})
export class PropertiesTestEntity extends BaseDocEntity<string> {
    @Id()
    name: string;

    @Property({
        password: true
    })
    password?: string;

    @Property({
        default: VALUE_DEFAULT,
        index: 1
    })
    value?: number;

    @Property({
        unique: true
    })
    uniqueValue?: number;

    @Property({
        dbProperty: 'value_1',
    })
    value1?: number;
}
