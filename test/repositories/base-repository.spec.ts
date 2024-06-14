import { Logger } from "@nestjs/common";
import { ConnectionService } from "@src/connection";
import { BaseRepository } from "@src/repositories";
import { Collection, Db, InsertManyResult, InsertOneResult, MongoClient } from "mongodb";
import { mock } from "ts-jest-mocker";

class TestImplementation extends BaseRepository<unknown> {
    protected logger = new Logger('BaseRepository');
}

const DB_NAME = 'dbName';
const COLLECTION_NAME = 'collectionName';
const mockedConnectionService = mock<ConnectionService>();
const mockedCollection = mock<Collection>();
const mockedClient = mock<MongoClient>();
const mockedDb = mock<Db>();

const DOC_ID = {
    _id: 0,
    value: 10
}

const DOC_NO_ID = {
    value: 10
}

const INSERT_ONE_RESULT: InsertOneResult = {
    acknowledged: false,
    insertedId: null
}

const INSERT_MANY_RESULT: InsertManyResult = {
    acknowledged: false,
    insertedCount: null,
    insertedIds: null
}

describe(BaseRepository.name, () => {
    let underTest: BaseRepository<unknown>;

    beforeEach(() => {
        mockedConnectionService.getMongoClient.mockReturnValue(mockedClient);
        mockedClient.db.mockReturnValue(mockedDb);
        mockedDb.collection.mockReturnValue(mockedCollection);

        underTest = new TestImplementation(mockedConnectionService, DB_NAME, COLLECTION_NAME);
    });

    describe('findOne', () => {
        it('should delegate to Collection', async () => {
            mockedCollection.findOne.mockResolvedValue(DOC_ID);

            const actual = await underTest.findOne(null);

            expect(actual).toBe(DOC_ID);
            expect(mockedCollection.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('insertOne', () => {
        it('should delegate to Collection', async () => {
            mockedCollection.insertOne.mockResolvedValue(INSERT_ONE_RESULT);

            const actual = await underTest.insertOne(DOC_NO_ID);

            expect(actual).toBeUndefined();
            expect(mockedCollection.insertOne).toHaveBeenCalledTimes(1);
        });
    });

    
    describe('insertMany', () => {
        it('should delegate to Collection', async () => {
            mockedCollection.insertMany.mockResolvedValue(INSERT_MANY_RESULT);

            const actual = await underTest.insertMany([DOC_NO_ID]);

            expect(actual).toBeUndefined();
            expect(mockedCollection.insertMany).toHaveBeenCalledTimes(1);
        });
    });
});
