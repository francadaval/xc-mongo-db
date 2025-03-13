import { Logger } from "@nestjs/common";

import { BaseRepository, Repository } from "@src/repositories";

import { E2E_TEST_DB } from "../../../utils/consts";
import { BaseTestEntity } from "./base-test.entity";

@Repository(E2E_TEST_DB, BaseTestEntity)
export class BaseTestEntityRepository extends BaseRepository<BaseTestEntity> {}
