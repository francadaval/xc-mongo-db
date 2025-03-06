import { BaseRepository, Repository } from "@src/repositories";
import { E2E_TEST_DB } from "../../../consts";
import { Logger } from "@nestjs/common";
import { PropertiesTestEntity } from "./properties-test.entity";

@Repository(E2E_TEST_DB, PropertiesTestEntity)
export class PropertiesTestEntityRepository extends BaseRepository<PropertiesTestEntity> {}
