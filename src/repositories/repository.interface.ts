export interface RepositoryInterface<T> {
    insertOne(doc: T): Promise<void>,
    insertMany(docs: T[]): Promise<void>
}
