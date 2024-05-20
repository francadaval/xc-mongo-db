import { BaseRepository, Repository, RepositoryMethod } from "../repositories";
import { TestEntity2 } from "./test-entity-2";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection_2';

@Repository(TEST_DB, TEST_COLLECTION)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {
    test_att = "Att value";

    @RepositoryMethod()
    findByValue1(value1: number): TestEntity2 { throw new Error('Repository not implemented.') };
}
