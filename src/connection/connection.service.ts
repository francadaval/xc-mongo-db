import { Injectable, Logger } from "@nestjs/common";
import { MongoClient, MongoClientOptions } from "mongodb";

type MongoClientFactory = (uri: string, options?: MongoClientOptions) => MongoClient;

@Injectable()
export class ConnectionService {
    private readonly logger = new Logger(ConnectionService.name);
    private client: MongoClient;

    constructor(
        connection_uri: string,
        options?: MongoClientOptions,
        mongoClientFactory: MongoClientFactory = (uri,options) => new MongoClient(uri,options)
    ) {
        this.client = mongoClientFactory(connection_uri,options);
        this.testConnection();
    }

    getMongoClient(): MongoClient {
         return this.client;
    }

    private async testConnection() {
        try {
            await this.client.db("admin").command({ ping: 1 });
            this.logger.log("Successfully connected to MongoDB!");
        } catch {
            this.logger.error("Error trying to connect to MongoDB!");
        }
    }
}
