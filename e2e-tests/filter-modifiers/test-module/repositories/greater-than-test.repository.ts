import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { GreaterThanTestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../../consts";

@Repository(E2E_TEST_DB, GreaterThanTestEntity)
export class GreaterThanTestRepository extends BaseRepository<GreaterThanTestEntity> {

    @RepositoryMethod()
    findOneByValueGreaterThan(_value: number): Promise<GreaterThanTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValueGreaterThan(_value: number): Promise<GreaterThanTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueGreaterThan(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueGreaterThan(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueGreaterThan(_value: number, _update: Partial<GreaterThanTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue(_value: number): Promise<GreaterThanTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
}