import { RepositoryMethod } from "../repositories";
import { BaseRepository } from "../repositories/base-repository";
import { Repository } from "../repositories/decorators/repository.decorator";
import { TestEntity } from "./test-entity";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection';

@Repository(TEST_DB, TEST_COLLECTION, TestEntity)
export abstract class TestRepo extends BaseRepository<TestEntity> {

    @RepositoryMethod()
    findByValue(value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.') 
    };
}
