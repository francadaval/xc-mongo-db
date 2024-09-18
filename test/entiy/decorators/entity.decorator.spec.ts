import { Entity, Id, Property } from '@src/entity/decorators'; 
import { MetadataKeys } from '@src/common/metadata-keys';
import { BaseDocEntity, BaseEntity } from '@src/entity';
import { compareSync } from 'bcrypt';

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

    @Property({
        password: true
    })
    password: string;
}

class TestIdEntity extends BaseDocEntity<string> {
    @Id()
    customId: string;
}

class TestEntityWithArray extends BaseDocEntity<string> {
    @Property({
        default: []
    })
    defaultArray: string[];
    @Property()
    array: string[];
    @Property({
        type: SubEntity
    })
    array2: SubEntity[];
}

class TestEntityWithDeepArray extends BaseDocEntity<string> {
    @Property()
    array: string[][];
    @Property({
        type: SubEntity
    })
    array2: SubEntity[][][];
}

const PROPERTIES = {
    value: {
        dbProperty: 'mainValue',
        type: SubEntity
    },
    name: {
        dbProperty: 'name'
    },
    password: {
        dbProperty: 'password',
        password: true
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
const PASSWORD = 'pass_F4K3!';

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

    it('should populate all properties from doc on creation', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntity({
            _id: ID,
            mainValue: VALUE,
            name: NAME,
            password: PASSWORD
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
        expect(instance.password).toBe(PASSWORD);
    });

    it('should populate all properties from doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);
        
        const instance = new TestEntity();
        instance.fromDoc({
            _id: ID,
            mainValue: VALUE,
            name: NAME,
            password: PASSWORD
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
        expect(instance.password).toBe(PASSWORD);
    });

    it('should serialize all properties to doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);
        
        const instance = new TestEntity({
            _id: ID,
            value: VALUE,
            name: NAME,
            password: PASSWORD
        }, false);

        const doc = instance.toDoc();

        expect(doc._id).toBe(ID);
        expect(doc.mainValue).toStrictEqual(VALUE);
        expect(doc.name).toBe(NAME);
        expect(doc.password).not.toBe(PASSWORD);
        expect(compareSync(PASSWORD, doc.password)).toBe(true);
    });

    it('should populate all properties from JSON', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntity);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntity();
        instance.fromJson({
            _id: ID,
            value: VALUE,
            name: NAME,
            password: PASSWORD
        });

        expect(instance._id).toBe(ID);
        expect(instance.value).toStrictEqual(VALUE_ENTITY);
        expect(instance.name).toBe(NAME);
        expect(instance.password).toBe(PASSWORD);
    });

    it('should populate all properties from JSON on creation with fromDoc = false', () => {
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

    it('should populate id property from doc as well', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestIdEntity);

        const instance = new TestIdEntity();
        instance.fromJson({
            customId: ID
        });

        expect(instance._id).toBe(ID);
    });

    it('should serialize array properties and default value to doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithArray);
        decorator(SubEntity);

        const instance = new TestEntityWithArray({
            _id: ID,
            array: ['test'],
            array2: [VALUE]
        });

        const doc = instance.toDoc();

        expect(doc._id).toBe(ID);
        expect(doc.array).toStrictEqual(['test']);
        expect(doc.array2).toStrictEqual([VALUE]);
        expect(doc.defaultArray).toStrictEqual([]);
    });

    it('should populate array properties and default value from doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithArray);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntityWithArray();
        instance.fromDoc({
            _id: ID,
            array: ['test'],
            array2: [VALUE]
        });

        expect(instance._id).toBe(ID);
        expect(instance.array).toStrictEqual(['test']);
        expect(instance.array2).toStrictEqual([VALUE_ENTITY]);
        expect(instance.defaultArray).toStrictEqual([]);
    });

    it('should populate array properties and default value from JSON', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithArray);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntityWithArray();
        instance.fromJson({
            _id: ID,
            array: ['test'],
            array2: [VALUE]
        });

        expect(instance._id).toBe(ID);
        expect(instance.array).toStrictEqual(['test']);
        expect(instance.array2).toStrictEqual([VALUE_ENTITY]);
        expect(instance.defaultArray).toStrictEqual([]);
    });

    it('should serialize deep array properties to doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithDeepArray);
        decorator(SubEntity);

        const instance = new TestEntityWithDeepArray({
            _id: ID,
            array: [['test']],
            array2: [[[VALUE]]]
        });

        const doc = instance.toDoc();

        expect(doc._id).toBe(ID);
        expect(doc.array).toStrictEqual([['test']]);
        expect(doc.array2).toStrictEqual([[[VALUE]]]);
    });

    it('should populate deep array properties to doc', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithDeepArray);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntityWithDeepArray();
        instance.fromDoc({
            _id: ID,
            array: [['test']],
            array2: [[[VALUE]]]
        });

        expect(instance._id).toBe(ID);
        expect(instance.array).toStrictEqual([['test']]);
        expect(instance.array2).toStrictEqual([[[VALUE_ENTITY]]]);
    });

    it('should populate deep array properties from JSON', () => {
        const decorator = Entity(PARAMETERS);
        decorator(TestEntityWithDeepArray);
        decorator(SubEntity);

        const VALUE_ENTITY = new SubEntity(VALUE);

        const instance = new TestEntityWithDeepArray();
        instance.fromJson({
            _id: ID,
            array: [['test']],
            array2: [[[VALUE]]]
        });

        expect(instance._id).toBe(ID);
        expect(instance.array).toStrictEqual([['test']]);
        expect(instance.array2).toStrictEqual([[[VALUE_ENTITY]]]);
    });
});
