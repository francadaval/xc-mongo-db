import { Injectable } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "../repositories/base-repository";
import { Repository } from "../repositories/repository.decorator";
import { TestEntity } from "./test-entity";

const TEST_DB = 'test_db';
const TEST_COLLECTION = 'test_collection';

@Injectable()
@Repository(TEST_DB, TEST_COLLECTION)
export class TestRepo extends BaseRepository<TestEntity> {
    constructor(connectionService: ConnectionService) {
        super(connectionService);
    };
}