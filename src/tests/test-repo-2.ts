import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository} from "../repositories";
import { TestEntity2 } from "./test-entity-2";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity2)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {

    @RepositoryMethod()
    findByValue1(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    };

    @RepositoryMethod()
    findByValue2(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    };
}
