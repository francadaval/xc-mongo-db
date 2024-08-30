import { Logger } from '@nestjs/common';
import { ConnectionService } from '@src/connection';
import { Entity, Property, Repository, RepositoryMethod } from '@src/decorators';
import { MetadataKeys } from '@src/decorators/metadata-keys';
import { BaseDocEntity } from '@src/entity';
import { BaseRepository } from '@src/repositories';
import { Collection, Db, MongoClient } from 'mongodb';
import { mock } from 'ts-jest-mocker';

const DB_NAME = 'dbName';
const mockedConnectionService = mock(ConnectionService);
const mockedMongoClient = mock(MongoClient);
const mockedDb = mock(Db);
const mockedCollection = mock(Collection);

@Entity()
class TestEntity extends BaseDocEntity<string>{
    @Property()
    value: number;
}

@Repository(DB_NAME, TestEntity)
class TestRepo extends BaseRepository<TestEntity> {
    protected logger = new Logger('TestRepo');

    @RepositoryMethod()
    findOneByValue(_value: number) {
        throw new Error('Method not implemented.');
    }
}

describe(Repository.name, () => {
    it('should return new constructor, methods parameters should exist', () => {
        mockedConnectionService.getMongoClient.mockReturnValue(mockedMongoClient);
        mockedMongoClient.db.mockReturnValue(mockedDb);
        mockedDb.collection.mockReturnValue(mockedCollection);

        new TestRepo(mockedConnectionService, null, null);
        const reflectedEntityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, TestRepo);
        const reflectedMethods = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, TestRepo);

        expect(mockedMongoClient.db).toHaveBeenCalledWith(DB_NAME);
        expect(mockedDb.collection).toHaveBeenCalledWith(TestEntity.name);
        expect(reflectedEntityType).toBe(TestEntity);
        expect(reflectedMethods).toEqual([TestRepo.prototype.findOneByValue.name]);
    });
});
