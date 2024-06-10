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
    value: number;
}

const PROPERTIES = {
    _id: {},
    value: {
        propertyDBName: 'mainValue',
        type: Number
    }
}

describe(Entity.name, () => {
    it('should ad parameters to reflect metadata, properties parameters should exist', () => {
        let decorator = Entity(PARAMETERS);
        decorator(TestClass);
        let actualParameters = Reflect.getOwnMetadata(MetadataKeys.ENTITY_DECORATOR_PARAMETERS, TestClass);
        let actualProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, TestClass);

        expect(actualParameters).toBe(PARAMETERS);
        expect(actualProperties).toEqual(PROPERTIES);
    });
});
