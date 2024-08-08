import { Entity, Property } from '@src/decorators'; 
import { MetadataKeys } from '@src/decorators/metadata-keys';

const COLLECION_NAME = 'collectionName';
const PARAMETERS = {collectionName: COLLECION_NAME};
class TestEntity {
    @Property()
    _id?: string;

    @Property({
        propertyDBName: 'mainValue',
        type: Number
    })
    // eslint-disable-next-line @typescript-eslint/ban-types
    value: Number;
}

const PROPERTIES = {
    _id: {},
    value: {
        propertyDBName: 'mainValue',
        type: Number
    }
}

const EXT_COLLECION_NAME = 'extCollectionName';
const EXT_PARAMETERS = {collectionName: EXT_COLLECION_NAME};
class ExtendedTestClass extends TestEntity {
    @Property({
        propertyDBName: 'extended'
    })
    extendedProperty: string;
}
const EXT_PROPERTIES = {
    _id: {},
    value: {
        propertyDBName: 'mainValue',
        type: Number
    },
    extendedProperty: {
        propertyDBName: 'extended'
    }
}

describe(Entity.name, () => {
    it('should add parameters to reflect metadata, properties parameters should exist', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        const actualParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, TestEntity);
        const actualProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, TestEntity);

        expect(actualParameters).toBe(PARAMETERS);
        expect(actualProperties).toEqual(PROPERTIES);
    });

    it('should include extended class properties', () => {
        const decorator = Entity(EXT_PARAMETERS);
        decorator(ExtendedTestClass);
        const actualParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, ExtendedTestClass);
        const actualProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, ExtendedTestClass);

        expect(actualParameters).toBe(EXT_PARAMETERS);
        expect(actualProperties).toEqual(EXT_PROPERTIES);
    });
});
