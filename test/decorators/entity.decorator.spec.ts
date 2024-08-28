import { Entity, Property } from '@src/decorators'; 
import { MetadataKeys } from '@src/decorators/metadata-keys';
import { BaseEntity } from '@src/entity';

const COLLECION_NAME = 'collectionName';
const PARAMETERS = {collectionName: COLLECION_NAME};
class TestEntity extends BaseEntity<string> {
    @Property({
        propertyDBName: 'mainValue',
        type: Number
    })
    // eslint-disable-next-line @typescript-eslint/ban-types
    value: Number;

    @Property()
    name: string;
}

const PROPERTIES = {
    value: {
        propertyDBName: 'mainValue',
        type: Number
    },
    name: {}
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
    ...PROPERTIES,
    extendedProperty: {
        propertyDBName: 'extended'
    }
}

const ID = '123';
const VALUE = 123;
const NAME = 'test';

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

    it('should populate all properties on creation', () => {
        const instance = new TestEntity({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toBe(VALUE);
        expect(instance.name).toBe(NAME);
    });

    it('should populate all properties', () => {
        const instance = new TestEntity();
        instance.populate({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toBe(VALUE);
        expect(instance.name).toBe(NAME);
    });

    it('should serialize all properties', () => {
        const instance = new TestEntity({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        const serialized = instance.serialize();

        expect(serialized._id).toBe(ID);
        expect(serialized.mainValue).toBe(VALUE);
        expect(serialized.name).toBe(NAME);
    });
});
