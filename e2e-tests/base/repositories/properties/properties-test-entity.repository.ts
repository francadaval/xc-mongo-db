import { BaseRepository, Repository } from "@src/repositories";
import { E2E_TEST_DB } from "../../../utils/consts";
import { PropertiesTestEntity } from "./properties-test.entity";

@Repository(E2E_TEST_DB, PropertiesTestEntity)
export class PropertiesTestEntityRepository extends BaseRepository<PropertiesTestEntity> {}
