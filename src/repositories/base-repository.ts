import { Logger } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { RepositoryInterface } from "./repository.interface";
import { EntityInterface } from "../entities";
import { Collection, InferIdType } from "mongodb";

export abstract class BaseRepository<T extends EntityInterface> implements RepositoryInterface<T> {
    abstract readonly logger: Logger
    readonly collection: Collection;

    protected constructor(protected connectionService: ConnectionService, db: string, collection: string) {
        let client = this.connectionService.getMongoClient();
        this.collection = client.db(db).collection(collection);
    };

    async insertOne(doc: T): Promise<void> {
        this.logger.log(`insertOne`);
        await this.collection.insertOne(doc);
    }

    async insertMany(docs: T[]): Promise<void> {
        this.logger.log(`insertMany`);
        await this.collection.insertMany(docs);
    }

    async findOne(_id: InferIdType<T>): Promise<T> {
        this.logger.log(`findOne`);
        const response = await this.collection.findOne({_id});
        return response as T;
    }
}
