import { Logger } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoryInterface } from "./repository.interface";

export abstract class BaseRepository<T> implements RepositoryInterface<T> {
    readonly logger: Logger
    constructor(private connectionService: ConnectionService, private connectionParams) {};

    async insertOne(doc: T): Promise<void> {
        this.logger.log(this.insertOne.name);
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(this.connectionParams.db);
        let collection = db.collection(this.connectionParams.collection);
        await collection.insertOne(doc);
    }

    async insertMany(docs: T[]): Promise<void> {
        this.logger.log(this.insertMany.name);
        let client = this.connectionService.getMongoClient();
        await client.connect();
        let db = client.db(this.connectionParams.db);
        let collection = db.collection(this.connectionParams.collection);
        await collection.insertMany(docs);
    }
}