import { MongoClient } from "mongodb";

const TEST_URI = "mongodb://root:epdsrntrMDB@localhost:27017";

export class ConnectionService {
    private client: MongoClient;

    constructor() {
    }

    getMongoClient(): MongoClient {
        if(!this.client) {
            this.client = new MongoClient(TEST_URI);
        }

        this.testConnection();

        return this.client;
    }

    private async testConnection() {
        try {
          // Connect the client to the server (optional starting in v4.7)
          await this.client.connect();
          // Send a ping to confirm a successful connection
          await this.client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          await this.client.close();
        }
    }
}
