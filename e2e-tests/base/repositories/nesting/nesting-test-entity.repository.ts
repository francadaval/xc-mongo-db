import { BaseRepository, Repository } from "@src/repositories";

import { NestingTestEntity } from "./nesting-test.entity";

import { E2E_TEST_DB } from "../../../utils/consts";

@Repository(E2E_TEST_DB, NestingTestEntity)
export class NestingTestEntityRepository extends BaseRepository<NestingTestEntity> {}
