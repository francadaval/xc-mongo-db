import { BaseRepository } from "../repositories/base-repository";
import { Repository } from "../repositories/repository.decorator";
import { TestEntity } from "./test-entity";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection';

@Repository(TEST_DB, TEST_COLLECTION)
export abstract class TestRepo extends BaseRepository<TestEntity> {
}
