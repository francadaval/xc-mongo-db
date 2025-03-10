import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { GreaterThanEqualTestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../../consts";

@Repository(E2E_TEST_DB, GreaterThanEqualTestEntity)
export class GreaterThanEqualTestRepository extends BaseRepository<GreaterThanEqualTestEntity> {

    @RepositoryMethod()
    findOneByValueGreaterThanEqual(_value: number): Promise<GreaterThanEqualTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValueGreaterThanEqual(_value: number): Promise<GreaterThanEqualTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueGreaterThanEqual(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueGreaterThanEqual(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueGreaterThanEqual(_value: number, _update: Partial<GreaterThanEqualTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue(_value: number): Promise<GreaterThanEqualTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
}