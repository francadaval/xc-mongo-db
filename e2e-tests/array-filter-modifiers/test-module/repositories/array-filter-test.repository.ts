import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";
import { E2E_TEST_DB } from "../../../consts";
import { ArrayFilterTestEntity } from "./array-filter-test.entity";

@Repository(E2E_TEST_DB, ArrayFilterTestEntity)
export class ArrayFilterTestRepository extends BaseRepository<ArrayFilterTestEntity> {

    @RepositoryMethod()
    findOneByValueIn(_values: number[]): Promise<ArrayFilterTestEntity> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    findAllByValueIn(_values: number[]): Promise<ArrayFilterTestEntity[]> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    countByValueIn(_values: number[]): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    deleteAllByValueIn(_values: number[]): Promise<number> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    updateByValueIn(_values: number[], _update: Partial<ArrayFilterTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    @RepositoryMethod()
    findOneByList(_value: number): Promise<ArrayFilterTestEntity> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    findAllByList(_value: number): Promise<ArrayFilterTestEntity[]> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    countByList(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    deleteAllByList(_value: number): Promise<number> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    updateByList(_value: number, _update: Partial<ArrayFilterTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    };

    
    @RepositoryMethod()
    findOneByListMatchAll(_values: number[]): Promise<ArrayFilterTestEntity> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    findAllByListMatchAll(_values: number[]): Promise<ArrayFilterTestEntity[]> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    countByListMatchAll(_values: number[]): Promise<number> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    deleteAllByListMatchAll(_values: number[]): Promise<number> {
        throw new Error('Method not implemented.');
    };

    @RepositoryMethod()
    updateByListMatchAll(_values: number[], _update: Partial<ArrayFilterTestEntity>): Promise<void> {
        throw new Error('Method not implemented.');
    };
};
