import { Repository, RepositoryMethod, BaseRepository } from "../";
import { TestEntity } from "./test-entity";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity)
export abstract class TestRepo extends BaseRepository<TestEntity> {

    @RepositoryMethod()
    findOneByValue(_value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    findOneByLockAndStock(_lockAndStock: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    findOneByValueAndLockAndStock(_lockAndStock: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    countBySubEntityValue(_value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }

    @RepositoryMethod()
    findOneByLockAndStockAndValueGreaterThan(_lockAndStock: number, _value: number): Promise<TestEntity> {
        throw new Error('Repository not implemented.');
    }
}
