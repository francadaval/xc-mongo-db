import { Logger } from "@nestjs/common";
import { ConnectionService } from "@src/connection";
import { EntityProperties } from "@src/decorators";
import { MetadataKeys } from "@src/decorators/metadata-keys";
import { EntityInterface } from "@src/entities";
import { BaseRepository, RepositoriesProviders } from "@src/repositories";
import { RepositoryMethodsBuilder } from "@src/repositories/builder/repo-method-builder";
import { Collection, Db, MongoClient } from "mongodb";
import { mock } from "ts-jest-mocker";

class TestEntity implements EntityInterface {
}

class TestSubEntity implements EntityInterface {
}


const TEST_ENTITY_PROPERTIES: EntityProperties = {
    prop1: {
        propertyDBName: 'prop1',
        type: TestSubEntity
    },
    prop2: {}
}

const TEST_SUBENTITY_PROPERTIES: EntityProperties = {
    subprop1: {
        propertyDBName: 'subprop1'
    },
    subprop2: {}
}

const mockedConnectionService = mock<ConnectionService>();
const mockedCollection = mock<Collection>();
const mockedMongoClient = mock<MongoClient>();
const mockedDb = mock<Db>();

const REPO_TYPES = [
    class extends BaseRepository<TestEntity> {
        protected logger = new Logger('Repository_1');
    }, class extends BaseRepository<TestEntity> {
        protected logger = new Logger('Repository_2');
    }
];

describe(RepositoriesProviders.name, () => {
    it('should return an array of factory providers', () => {
        // Arrange
        const expected = [
            {
                provide: expect.any(Function),
                useFactory: expect.any(Function),
                inject: expect.any(Array)
            },
            {
                provide: expect.any(Function),
                useFactory: expect.any(Function),
                inject: expect.any(Array)
            }
        ];

        // Act
        const actual = RepositoriesProviders(REPO_TYPES);

        // Assert
        expect(actual).toEqual(expected);
    });

    it('factory should create and register repository', () => {
        // Arrange
        const methodsBuilder = mock<RepositoryMethodsBuilder>();
        const factory = RepositoriesProviders(REPO_TYPES)[0];

        methodsBuilder.buildRepositoryMethod.mockReturnValue(jest.fn());
        mockedConnectionService.getMongoClient.mockReturnValue(mockedMongoClient);
        mockedMongoClient.db.mockReturnValue(mockedDb);
        mockedDb.collection.mockReturnValue(mockedCollection);

        Reflect.defineMetadata(MetadataKeys.REPOSITORY_METHODS, ['method1', 'method2'], REPO_TYPES[0]);
        Reflect.defineMetadata(MetadataKeys.ENTITY_TYPE, TestEntity, REPO_TYPES[0]);
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, TEST_ENTITY_PROPERTIES, TestEntity);
        Reflect.defineMetadata(MetadataKeys.ENTITY_PROPERTIES, TEST_SUBENTITY_PROPERTIES, TestSubEntity);
        
        const expected = expect.any(REPO_TYPES[0]);

        // Act
        const actual = factory.useFactory(mockedConnectionService, methodsBuilder);

        // Assert
        expect(actual).toEqual(expected);
        expect(actual.method1).toBeDefined();
        expect(actual.method2).toBeDefined();
        expect(methodsBuilder.buildRepositoryMethod).toHaveBeenCalledTimes(2);
    });
});
