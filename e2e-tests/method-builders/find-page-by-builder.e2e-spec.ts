import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { TestModule } from "./test-module/test.module";
import { PageTestEntity } from "./test-module/page/page-test.entity";
import { PageTestEntityRepository } from "./test-module/page/page-test-entity.repository";
import { PageRequest } from "@src/pagination";

const DEFAULT_INDEX = 0;
const DEFAULT_SIZE = 10;

describe('Method findPageBy Builders Tests', () => {
    let app: INestApplicationContext;
    let repo: PageTestEntityRepository;
    let testEntities: PageTestEntity[];

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(PageTestEntityRepository);
        await resetCollection();
    });

    afterAll(async () => {
        repo.collection.drop();
        app.close();
    });

    it('should return page of entities', async () => {
        const pageRequest: PageRequest = {
            page_index: 2,
            page_size: 12
        }

        const page = await repo.findPageByValue(42, pageRequest);
        const expectedTotal = testEntities.filter((entity) => entity.value === 42).length;

        expect(page.items.length).toBe(pageRequest.page_size);
        expect(page.total_size).toBe(expectedTotal);
        expect(page.page_size).toBe(pageRequest.page_size);
        expect(page.page_index).toBe(pageRequest.page_index);
        page.items.forEach((item) => {
            expect(item.value).toBe(42);
        });
    });

    it('should return shorter last page of entities', async () => {
        const page_size = 12;
        const expectedTotal = testEntities.filter((entity) => entity.value === 42).length;
        const page_index = Math.floor(expectedTotal / page_size);
        const pageRequest: PageRequest = {
            page_index,
            page_size
        };
        const expectedItems = expectedTotal % page_size;

        const page = await repo.findPageByValue(42, pageRequest);

        expect(page.items.length).toBe(expectedItems);
        expect(page.total_size).toBe(expectedTotal);
        expect(page.page_size).toBe(pageRequest.page_size);
        expect(page.page_index).toBe(pageRequest.page_index);
        page.items.forEach((item) => {
            expect(item.value).toBe(42);
        });
    });

    it('should return empty page if index is higher than last one', async () => {
        const expectedTotal = testEntities.filter((entity) => entity.value === 42).length;
        const page_size = 12;
        const page_index = Math.floor(expectedTotal / page_size) + 1;

        const pageRequest: PageRequest = {
            page_index,
            page_size
        };

        const page = await repo.findPageByValue(42, pageRequest);

        expect(page.items.length).toBe(0);
        expect(page.total_size).toBe(expectedTotal);
        expect(page.page_size).toBe(page_size);
        expect(page.page_index).toBe(page_index);
    });

    it('should return default page (first) if index is negative', async () => {
        const page_size = 12;
        const page_index = -1;

        const pageRequest: PageRequest = {
            page_index,
            page_size
        };

        const page = await repo.findPageByValue(42, pageRequest);

        expect(page.items.length).toBe(page_size);
        expect(page.page_size).toBe(page_size);
        expect(page.page_index).toBe(DEFAULT_INDEX);
    });


    it('should return page of entities with default pagination when absent', async () => {
        const page = await repo.findPageByValue(42, {});

        expect(page.items.length).toBe(DEFAULT_SIZE);
        expect(page.page_size).toBe(DEFAULT_SIZE);
        expect(page.page_index).toBe(DEFAULT_INDEX);
    });

    async function resetCollection() {
        const testEntitiesJson = [];
        for (let i = 0; i < 100; i++) {
            testEntitiesJson.push({
                name: `test_name_${i}`,
                value: 42 + (i % 2)
            });
        }

        testEntities = testEntitiesJson.map((json) => new PageTestEntity(json, false));

        await repo.collection.deleteMany({});
        await repo.collection.insertMany(testEntities);
    };
});
