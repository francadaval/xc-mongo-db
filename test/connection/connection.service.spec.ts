import { ConnectionService } from "@src/connection";
import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { mock } from "ts-jest-mocker";

const mockedMongoClient = mock(MongoClient);
const mockedDb = mock(Db);

describe(ConnectionService.name, () => {
    it('should create MongoClient with connection uri and options', () => {
        const connectionUri = 'mongodb://localhost:27017';
        const options: MongoClientOptions = { checkKeys: false };
        const mongoClientFactory = jest.fn().mockReturnValue(mockedMongoClient);
        mockedMongoClient.db.mockReturnValue(mockedDb);

        const connectionService = new ConnectionService(
            connectionUri,
            options,
            mongoClientFactory
        );

        expect(mongoClientFactory).toHaveBeenCalledWith(connectionUri, options);
        expect(connectionService.getMongoClient()).toBe(mockedMongoClient);
        expect(mockedMongoClient.db).toHaveBeenCalled();
        expect(mockedDb.command).toHaveBeenCalled();
    });
});
