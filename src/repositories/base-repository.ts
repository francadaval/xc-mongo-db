import { Logger } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoryInterface } from "./repository.interface";
import { EntityId, EntityInterface } from "../entities";
import { Collection } from "mongodb";

export abstract class BaseRepository<T extends EntityInterface> implements RepositoryInterface<T> {
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

    async findOne(_id: EntityId): Promise<T> {
        this.logger.log(`findOne`);
        const response = await this.collection.findOne({_id});
        return response as T;
    }

    async deleteOne(_id: EntityId): Promise<void> {
        this.logger.log(`deleteOne`);
        await this.collection.deleteOne({_id});
    }

    async updateOne(_id: EntityId, doc: T): Promise<void> {
        this.logger.log(`updateOne`);
        await this.collection.updateOne({_id}, {$set: doc});
    }
}
