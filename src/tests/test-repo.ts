import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository } from "../repositories/base-repository";
import { TestEntity } from "./test-entity";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity)
export abstract class TestRepo extends BaseRepository<TestEntity> {

    @RepositoryMethod()
    findOneByValue(value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    };

    @RepositoryMethod()
    findOneByLockAndStock(lockAndStock: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    findOneByValueAndLockAndStock(lockAndStock: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    countBySubEntityValue(value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }
}
