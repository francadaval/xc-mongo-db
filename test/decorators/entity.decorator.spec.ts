import { Entity, Property } from '@src/decorators'; 
import { MetadataKeys } from '@src/decorators/metadata-keys';
import { EntityInterface } from '@src/entities';

const COLLECION_NAME = 'collectionName';
const PARAMETERS = {collectionName: COLLECION_NAME};
class TestClass implements EntityInterface {
    @Property()
    _id?: string;

    @Property({
        propertyDBName: 'mainValue',
        type: Number
    })
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
class ExtendedTestClass extends TestClass {
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
        let decorator = Entity(PARAMETERS);
        decorator(TestClass);
        let actualParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, TestClass);
        let actualProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, TestClass);

        expect(actualParameters).toBe(PARAMETERS);
        expect(actualProperties).toEqual(PROPERTIES);
    });

    it('should include extended class properties', () => {
        let decorator = Entity(EXT_PARAMETERS);
        decorator(ExtendedTestClass);
        let actualParameters = Reflect.getMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, ExtendedTestClass);
        let actualProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, ExtendedTestClass);

        expect(actualParameters).toBe(EXT_PARAMETERS);
        expect(actualProperties).toEqual(EXT_PROPERTIES);
    });
});
