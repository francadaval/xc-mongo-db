import { Page, PageRequest } from "@src/pagination";
import { E2E_TEST_DB } from "../../consts";
import { PageTestEntity } from "./page-test.entity";
import { BaseRepository, Repository, RepositoryMethod } from "@src/repositories";

@Repository(E2E_TEST_DB, PageTestEntity)
export class PageTestEntityRepository extends BaseRepository<PageTestEntity> {

    @RepositoryMethod()
    findPageByValue(
        _value: number,
        _pageRequest: PageRequest
    ): Promise<Page<PageTestEntity>> {
        throw new Error('Method not implemented.');
    };
}
