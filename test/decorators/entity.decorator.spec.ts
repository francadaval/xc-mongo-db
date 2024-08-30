import { Entity, Id, Property } from '@src/decorators'; 
import { MetadataKeys } from '@src/decorators/metadata-keys';
import { BaseDocEntity, BaseEntity } from '@src/entity';

const COLLECION_NAME = 'collectionName';
const PARAMETERS = {collectionName: COLLECION_NAME};

class SubEntity extends BaseEntity{
    @Property()
    subValue: number;

    @Property()
    subValue2: string;
}

class TestEntity extends BaseDocEntity<string> {
    @Property({
        dbProperty: 'mainValue',
        type: SubEntity
    })
    value: SubEntity;

    @Property()
    name: string;
}

class TestIdEntity extends BaseDocEntity<string> {
    @Id()
    customId: string;
}

const PROPERTIES = {
    value: {
        dbProperty: 'mainValue',
        type: SubEntity
    },
    name: {
        dbProperty: 'name'
    }
}

const EXT_COLLECION_NAME = 'extCollectionName';
const EXT_PARAMETERS = {collectionName: EXT_COLLECION_NAME};
class ExtendedTestClass extends TestEntity {
    @Property({
        dbProperty: 'extended'
    })
    extendedProperty: string;
}
const EXT_PROPERTIES = {
    ...PROPERTIES,
    extendedProperty: {
        dbProperty: 'extended'
    }
}

const ID = '123';
const VALUE = {
    subValue: 1,
    subValue2: 'test'
};
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
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntity({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
    });

    it('should populate all properties', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);
        
        const instance = new TestEntity();
        instance.populate({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
    });

    it('should serialize all properties', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);
        
        const instance = new TestEntity({
            _id: ID,
            mainValue: VALUE,
            name: NAME
        });

        const serialized = instance.serialize();

        expect(serialized._id).toBe(ID);
        expect(serialized.mainValue).toStrictEqual(VALUE);
        expect(serialized.name).toBe(NAME);
    });

    it('should deserialize all properties', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntity();
        instance.deserialize({
            _id: ID,
            value: VALUE,
            name: NAME
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
    });

    it('should deserialize all properties on creation with fromDB = false', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntity({
            _id: ID,
            value: VALUE_ENTITY,
            name: NAME
        }, false);

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
    });

    it('should deserialize id property as well', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestIdEntity);

        const instance = new TestIdEntity();
        instance.deserialize({
            customId: ID
        });

        expect(instance._id).toBe(ID);
    });
});
