export interface MongoOperations<T> {
    insertOne(doc: T): Promise<void>,
    insertMany(docs: T[]): Promise<void>
}
