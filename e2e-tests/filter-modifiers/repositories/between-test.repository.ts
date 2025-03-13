import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { BetweenTestEntity, TestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../utils/consts";

@Repository(E2E_TEST_DB, BetweenTestEntity)
export class BetweenTestRepository extends BaseRepository<TestEntity> {

    @RepositoryMethod()
    findOneByValueBetween(_value1: number, _value2: number): Promise<TestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValueBetween(_value1: number, _value2: number): Promise<TestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueBetween(_value1: number, _value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueBetween(_value1: number, _value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueBetween(_value1: number, _value2: number, _update: Partial<TestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue(_value: number): Promise<TestEntity[]> {
        throw new Error('Method not implemented.');
    }
}