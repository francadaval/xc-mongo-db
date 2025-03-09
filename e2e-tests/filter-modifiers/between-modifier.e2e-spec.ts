import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { BetweenTestRepository } from "./test-module/base/between-test.repository";
import { TestModule } from "./test-module/test.module";
import { BetweenTestEntity } from "./test-module/base/test.entity";

describe('Between Filter Modifier', () => {

    let app: INestApplicationContext;
    let repo: BetweenTestRepository;
    let testEntities: BetweenTestEntity[];

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(BetweenTestRepository);
        await resetCollection();
    });

    afterAll(async () => {
        await repo.collection.drop();
        app.close();
    });

    it('module should be defined', async () => {
        expect(app).toBeDefined();
    });

    it('repository should be defined', async () => {
        expect(repo).toBeDefined();
    });

    it('findOneBy with between modifier should return value', async () => {
        const entity = await repo.findOneByValueBetween(10, 20);

        expect(entity).toBeDefined();
        expect(entity.value).toBeGreaterThanOrEqual(10);
        expect(entity.value).toBeLessThanOrEqual(20);
    });

    it('findOneBy with between modifier should return null if not found', async () => {
        const entity = await repo.findOneByValueBetween(101, 200);

        expect(entity).toBeNull();
    });

    it('findManyBy with between modifier should return values', async () => {
        const expected = testEntities.filter((entity) => entity.value > 10 && entity.value < 20);

        const entities = await repo.findAllByValueBetween(10, 20);

        expect(entities.length).toBe(expected.length);
        entities.forEach((entity) => {
            expect(entity.value).toBeGreaterThanOrEqual(10);
            expect(entity.value).toBeLessThanOrEqual(20);
        });
    });

    it('findManyBy with between modifier should return empty array if not found', async () => {
        const entities = await repo.findAllByValueBetween(101, 200);

        expect(entities.length).toBe(0);
    });

    it('countBy with between modifier should return count', async () => {
        const expected = testEntities.filter((entity) => entity.value > 10 && entity.value < 20).length;

        const count = await repo.countByValueBetween(10, 20);

        expect(count).toBe(expected);
    });

    it('countBy with between modifier should return 0 if not found', async () => {
        const count = await repo.countByValueBetween(101, 200);

        expect(count).toBe(0);
    });

    it('deleteAllBy with between modifier should delete entities', async () => {
        const expected = testEntities.filter((entity) => entity.value > 10 && entity.value < 20).length;

        const deleted = await repo.deleteAllByValueBetween(10, 20);
        const entities = await repo.findAllByValueBetween(10, 20);

        expect(deleted).toBe(expected);
        expect(entities.length).toBe(0);

        await resetCollection();
    });

    it('deleteAllBy with between modifier should return 0 if not found', async () => {
        const deleted = await repo.deleteAllByValueBetween(101, 200);

        expect(deleted).toBe(0);
    });

    it('updateBy with between modifier should update entities', async () => {
        const update = {
            value: 200
        };
        const expected = testEntities.filter((entity) => entity.value > 10 && entity.value < 20).length;

        await repo.updateByValueBetween(10, 20, update);
        const updated = await repo.findAllByValue(update.value);

        expect(updated.length).toBe(expected);
        updated.forEach((entity) => {
            expect(entity.value).toBe(update.value);
        });

        await resetCollection();
    });

    it('updateBy with between modifier should return 0 if not found', async () => {
        const update = {
            value: 200
        };

        await repo.updateByValueBetween(101, 200, update);
        const updated = await repo.countByValue(update.value);

        expect(updated).toBe(0);

        await resetCollection();
    });

    async function resetCollection() {
        await repo.collection.deleteMany({});

        testEntities = [];
        for (let i = 0; i < 100; i++) {
            testEntities.push(new BetweenTestEntity({
                name: `name_${i}`,
                value: i
            }));
        }

        await repo.insertMany(testEntities);
    }
});
