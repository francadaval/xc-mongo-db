import { Filter } from "mongodb";
import { ConnectionService } from "../connection";
import { MongoOperations } from "../operations";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection';

export class Repository<T> implements MongoOperations<T> {

    constructor(private connectionService: ConnectionService) {};

    async insertOne(doc: T): Promise<void> {
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(TEST_DB);
        let collection = db.collection(TEST_COLLECTION);
        await collection.insertOne(doc);
    }

    async insertMany(docs: T[]): Promise<void> {
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(TEST_DB);
        let collection = db.collection(TEST_COLLECTION);
        await collection.insertMany(docs);
    }
}