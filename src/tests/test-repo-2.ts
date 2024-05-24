import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository} from "../repositories";
import { TestEntity2 } from "./test-entity-2";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity2)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {

    @RepositoryMethod()
    findOneByValue1(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    };

    @RepositoryMethod()
    findOneByValue2(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    };

    @RepositoryMethod()
    findOneByValue1AndValue2(value1: number, value2: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    };
}
