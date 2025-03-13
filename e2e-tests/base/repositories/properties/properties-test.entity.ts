import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

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
        default: 101,
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
