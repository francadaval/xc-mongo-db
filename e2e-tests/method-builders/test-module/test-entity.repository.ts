import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { TestEntity } from "./test.entity";
import { E2E_TEST_DB } from "../../consts";

@Repository(E2E_TEST_DB, TestEntity)
export class TestEntityRepository extends BaseRepository<TestEntity> {

    @RepositoryMethod()
    findOneByValue1(_value1: number): Promise<TestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findOneByValue2(_value2: number): Promise<TestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue1(_value1: number): Promise<TestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue2(_value2: number): Promise<TestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue1(_value1: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue2(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValue1(_value1: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValue2(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
}