import { ConnectionService } from "../connection";
import { RepositoryInterface } from "./repository.interface";

export class BaseRepository<T> implements RepositoryInterface<T> {

    constructor(private connectionService: ConnectionService, private connectionParams) {};

    async insertOne(doc: T): Promise<void> {
        console.log("BaseRepository: insertOne")
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(this.connectionParams.db);
        let collection = db.collection(this.connectionParams.collection);
        await collection.insertOne(doc);
    }

    async insertMany(docs: T[]): Promise<void> {
        console.log("BaseRepository: insertMany")
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(this.connectionParams.db);
        let collection = db.collection(this.connectionParams.collection);
        await collection.insertMany(docs);
    }
}