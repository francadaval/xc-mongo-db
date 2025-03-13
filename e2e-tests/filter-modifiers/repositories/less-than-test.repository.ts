import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { LessThanTestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../utils/consts";

@Repository(E2E_TEST_DB, LessThanTestEntity)
export class LessThanTestRepository extends BaseRepository<LessThanTestEntity> {

    @RepositoryMethod()
    findOneByValueLessThan(_value: number): Promise<LessThanTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValueLessThan(_value: number): Promise<LessThanTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueLessThan(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueLessThan(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueLessThan(_value: number, _update: Partial<LessThanTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue(_value: number): Promise<LessThanTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
}