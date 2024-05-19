import { BaseRepository } from "../repositories/base-repository";
import { Repository } from "../repositories/repository.decorator";
import { TestEntity2 } from "./test-entity-2";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection_2';

@Repository(TEST_DB, TEST_COLLECTION)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {
}
