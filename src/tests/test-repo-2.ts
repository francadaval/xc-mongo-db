import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository} from "../repositories";
import { TestEntity2 } from "./test-entity-2";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection_2';

@Repository(TEST_DB, TEST_COLLECTION)
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
