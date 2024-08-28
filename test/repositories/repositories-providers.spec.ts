import { Logger } from "@nestjs/common";
import { ConnectionService } from "@src/connection";
import { EntityProperties } from "@src/decorators";
import { MetadataKeys } from "@src/decorators/metadata-keys";
import { BaseEntity } from "@src/entity";
import { BaseRepository, repositoryFactoryProvider } from "@src/repositories";
import { RepositoryMethodsBuilder } from "@src/repositories/builder/repo-method-builder";
import { Collection, Db, MongoClient } from "mongodb";
import { mock } from "ts-jest-mocker";

class TestEntity extends BaseEntity {
}

class TestSubEntity {
}

const TEST_ENTITY_PROPERTIES: EntityProperties = {
    prop1: {
        propertyDBName: 'prop_1',
        type: TestSubEntity
    },
    prop2: {
        unique: true
    }
}

const TEST_SUBENTITY_PROPERTIES: EntityProperties = {
    subprop1: {
        propertyDBName: 'subprop_1'
    },
    subprop2: {}
}

const EXPECTED_PROP_NAMES = ['prop1', 'prop2', 'prop1.subprop1', 'prop1.subprop2'];
const EXPECTED_DB_PROP_NAMES = ['prop_1', 'prop2', 'prop_1.subprop_1', 'prop_1.subprop2'];

const mockedConnectionService = mock<ConnectionService>();
const mockedCollection = mock<Collection>();
const mockedMongoClient = mock<MongoClient>();
const mockedDb = mock<Db>();

class TestRepo extends BaseRepository<TestEntity> {
    protected logger = new Logger('TestRepo');
}

describe(repositoryFactoryProvider.name, () => {
    it('factory should create and register repository', () => {
        // Arrange
        const methodsBuilder = mock<RepositoryMethodsBuilder>();
        
        methodsBuilder.buildRepositoryMethod.mockReturnValue(jest.fn());
        mockedConnectionService.getMongoClient.mockReturnValue(mockedMongoClient);
        mockedMongoClient.db.mockReturnValue(mockedDb);
        mockedDb.collection.mockReturnValue(mockedCollection);
        mockedCollection.createIndex.mockReturnValue(Promise.resolve('index'));
        
        Reflect.defineMetadata(MetadataKeys.REPOSITORY_METHODS, ['method1', 'method2'], TestRepo);
        Reflect.defineMetadata(MetadataKeys.ENTITY_TYPE, TestEntity, TestRepo);
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, TEST_ENTITY_PROPERTIES, TestEntity);
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, TEST_SUBENTITY_PROPERTIES, TestSubEntity);
        
        const expected = expect.any(TestRepo);
        
        // Act
        const factory = repositoryFactoryProvider(TestRepo);
        const actual = factory.useFactory(mockedConnectionService, methodsBuilder);

        // Assert
        expect(actual).toEqual(expected);
        expect(actual.method1).toBeDefined();
        expect(actual.method2).toBeDefined();
        expect(methodsBuilder.buildRepositoryMethod).toHaveBeenCalledWith(
            'method1',
            EXPECTED_PROP_NAMES,
            EXPECTED_DB_PROP_NAMES
        );
        expect(methodsBuilder.buildRepositoryMethod).toHaveBeenCalledWith(
            'method2',
            EXPECTED_PROP_NAMES,
            EXPECTED_DB_PROP_NAMES
        );
        expect(methodsBuilder.buildRepositoryMethod).toHaveBeenCalledTimes(2);
        expect(mockedCollection.createIndex).toHaveBeenCalledWith('prop2', {unique: true});
    });
});
