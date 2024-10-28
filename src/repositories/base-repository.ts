import { Logger } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { Collection, Document, InferIdType, WithoutId } from "mongodb";
import { BaseDocEntity } from "../entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRepository<T extends BaseDocEntity<any>> {
    protected abstract logger: Logger
    readonly collection: Collection;

    constructor(protected connectionService: ConnectionService, dbName: string, collectionName: string) {
        const client = this.connectionService.getMongoClient();
        this.collection = client.db(dbName).collection(collectionName);
    }

    async insertOne(entity: T): Promise<void> {
        this.logger.log(`insertOne`);
        await this.collection.insertOne(entity.toDoc());
    }

    async insertMany(entities: T[]): Promise<void> {
        this.logger.log(`insertMany`);
        const docs = entities.map(entity => entity.toDoc());
        await this.collection.insertMany(docs);
    }

    async findOne(_id: InferIdType<T>): Promise<T> {
        this.logger.log(`findOne`);
        const response = await this.collection.findOne({_id});
        return response !== null ? this.createEntity(response) : null;
    }

    async deleteOne(_id: InferIdType<T>): Promise<void> {
        this.logger.log(`deleteOne`);
        await this.collection.deleteOne({_id});
    }

    async deleteAll(): Promise<void> {  
        this.logger.log(`removeAll`);
        await this.collection.deleteMany({});
    }

    async updateOne(_id: InferIdType<T>, doc: Partial<WithoutId<T>>): Promise<void> {
        this.logger.log(`updateOne`);
        const updating = doc.toDoc ? doc.toDoc() : doc;
        await this.collection.updateOne({_id}, {$set: updating});
    }

    protected createEntity(_data: Document): T {
        throw new Error('Not implemented');
    }
}
