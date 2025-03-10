import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { LessThanEqualTestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../../consts";

@Repository(E2E_TEST_DB, LessThanEqualTestEntity)
export class LessThanEqualTestRepository extends BaseRepository<LessThanEqualTestEntity> {

    @RepositoryMethod()
    findOneByValueLessThanEqual(_value: number): Promise<LessThanEqualTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValueLessThanEqual(_value: number): Promise<LessThanEqualTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueLessThanEqual(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueLessThanEqual(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueLessThanEqual(_value: number, _update: Partial<LessThanEqualTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue(_value: number): Promise<LessThanEqualTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
}