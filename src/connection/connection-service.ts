import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";

const TEST_URI = "mongodb://root:epdsrntrMDB@localhost:27017";

@Injectable()
export class ConnectionService {
    private client: MongoClient;

    constructor() {
    }

    getMongoClient(): MongoClient {
        if(!this.client) {
            this.client = new MongoClient(TEST_URI);
            this.testConnection();
        }

        return this.client;
    }

    private async testConnection() {
        try {
            await this.client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch {
            console.log("Error trying to connect to MongoDB!");
        }
    }
}
