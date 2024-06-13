/* eslint-disable @typescript-eslint/no-unused-vars */
import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository} from "../repositories";
import { TestEntity2 } from "./test-entity-2";
import { Page, PageRequest } from "../pagination";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity2)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {

    @RepositoryMethod()
    findOneByValue1(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findPageByValue1(value1: number, pageRequest: PageRequest): Promise<Page<TestEntity2>> {
        throw new Error('Repository not implemented.')
    }
    
    @RepositoryMethod()
    findOneByValue2(value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findOneByValue1AndValue2(value1: number, value2: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findAllByValue1AndValue2(value1: number, value2: number): Promise<TestEntity2[]> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    countByValue1(value1: number) {
        throw new Error('Repository not implemented.')
    }
}
