import { Logger } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { Collection, Document, InferIdType, WithId } from "mongodb";

export abstract class BaseRepository<T extends Document> {
    protected abstract logger: Logger
    readonly collection: Collection;

    constructor(protected connectionService: ConnectionService, dbName: string, collectionName: string) {
        const client = this.connectionService.getMongoClient();
        this.collection = client.db(dbName).collection(collectionName);
    }

    async insertOne(doc: T): Promise<void> {
        this.logger.log(`insertOne`);
        await this.collection.insertOne(doc);
    }

    async insertMany(docs: T[]): Promise<void> {
        this.logger.log(`insertMany`);
        await this.collection.insertMany(docs);
    }

    async findOne(_id: InferIdType<T>): Promise<WithId<T>> {
        this.logger.log(`findOne`);
        const response = await this.collection.findOne({_id});
        return response as WithId<T>;
    }

    async deleteOne(_id: InferIdType<T>): Promise<void> {
        this.logger.log(`deleteOne`);
        await this.collection.deleteOne({_id});
    }

    async updateOne(_id: InferIdType<T>, doc: T): Promise<void> {
        this.logger.log(`updateOne`);
        await this.collection.updateOne({_id}, {$set: doc});
    }
}
