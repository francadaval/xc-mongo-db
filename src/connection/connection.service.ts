import { Injectable, Logger } from "@nestjs/common";
import { MongoClient, MongoClientOptions } from "mongodb";

@Injectable()
export class ConnectionService {
    private readonly logger = new Logger(ConnectionService.name);
    private client: MongoClient;

    constructor(connection_uri: string, options?: MongoClientOptions) {
        this.client = new MongoClient(connection_uri, options);
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
