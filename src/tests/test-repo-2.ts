import { Repository, RepositoryMethod } from "../decorators";
import { BaseRepository} from "../repositories";
import { TestEntity2 } from "./test-entity-2";
import { Page, PageRequest } from "../pagination";

const TEST_DB = 'test_db';

@Repository(TEST_DB, TestEntity2)
export abstract class TestRepo2 extends BaseRepository<TestEntity2> {

    @RepositoryMethod()
    findOneByValue1(_value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findPageByValue1(_value1: number, _pageRequest: PageRequest): Promise<Page<TestEntity2>> {
        throw new Error('Repository not implemented.')
    }
    
    @RepositoryMethod()
    findOneByValue2(_value1: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findOneByValue1AndValue2(_value1: number, _value2: number): Promise<TestEntity2> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    findAllByValue1AndValue2(_value1: number, _value2: number): Promise<TestEntity2[]> {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    countByValue1(_value1: number) {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    deleteAllByValue1(_value1: number) {
        throw new Error('Repository not implemented.')
    }

    @RepositoryMethod()
    deleteAllByValue2(_value2: number) {
        throw new Error('Repository not implemented.')
    }
}
