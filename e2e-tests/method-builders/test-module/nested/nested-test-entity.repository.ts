import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

import { NestingTestEntity } from "./nesting-test.entity";

import { E2E_TEST_DB } from "../../../consts";

@Repository(E2E_TEST_DB, NestingTestEntity)
export class NestedTestEntityRepository extends BaseRepository<NestingTestEntity> {
    @RepositoryMethod()
    findOneByNestedName(_name: string): Promise<NestingTestEntity> {
        throw new Error('Method not implemented.');
    }
    
    @RepositoryMethod()
    findOneByNestedValue(_value: number): Promise<NestingTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findOneByNestedValue2(_value2: number): Promise<NestingTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findOneByValue2OfNested(_value2: number): Promise<NestingTestEntity> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByNestedName(_name: string): Promise<NestingTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByNestedValue(_value: number): Promise<NestingTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByNestedValue2(_value2: number): Promise<NestingTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findAllByValue2OfNested(_value2: number): Promise<NestingTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByNestedName(_name: string): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByNestedValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByNestedValue2(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValue2OfNested(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByNestedName(_name: string): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByNestedValue(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByNestedValue2(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValue2OfNested(_value2: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByNestedName(_name: string, _update: Partial<NestingTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByNestedValue(_value: number, _update: Partial<NestingTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByNestedValue2(_value2: number, _update: Partial<NestingTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValue2OfNested(_value2: number, _update: Partial<NestingTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
