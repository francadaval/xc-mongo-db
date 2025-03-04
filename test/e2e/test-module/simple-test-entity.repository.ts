import { Logger } from "@nestjs/common";

import { BaseRepository, Repository } from "@src/repositories";

import { SimpleTestEntity } from "./simple-test.entity";
import { E2E_TEST_DB } from "../consts";

@Repository(E2E_TEST_DB, SimpleTestEntity)
export class SimpleTestEntityRepository extends BaseRepository<SimpleTestEntity> {
    protected logger: Logger;
}
