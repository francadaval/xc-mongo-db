import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { LessThanTestEntity } from "./test-module/repositories/test.entity";
import { TestModule } from "./test-module/test.module";
import { LessThanTestRepository } from "./test-module/repositories/less-than-test.repository";

describe('Greater than Filter Modifier', () => {

    let app: INestApplicationContext;
    let repo: LessThanTestRepository;
    let testEntities: LessThanTestEntity[];
    
    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(LessThanTestRepository);
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

    it('findOneBy with less than modifier should return value', async () => {
        const entity = await repo.findOneByValueLessThan(10);

        expect(entity).toBeDefined();
        expect(entity.value).toBeLessThanOrEqual(10);
    });

    it('findOneBy with less than modifier should return null if not found', async () => {
        const entity = await repo.findOneByValueLessThan(0);

        expect(entity).toBeNull();
    });

    it('findAllBy with less than modifier should return values', async () => {
        const expectedLength = testEntities.filter((entity) => entity.value < 10).length;
        const entities = await repo.findAllByValueLessThan(10);

        expect(entities.length).toBe(expectedLength);
        entities.forEach((entity) => {
            expect(entity.value).toBeLessThanOrEqual(10);
        });
    });

    it('findAllBy with less than modifier should return empty array if not found', async () => {
        const entities = await repo.findAllByValueLessThan(0);

        expect(entities.length).toBe(0);
    });

    it('countBy with less than modifier should return count', async () => {
        const expectedLength = testEntities.filter((entity) => entity.value < 10).length;
        const count = await repo.countByValueLessThan(10);

        expect(count).toBe(expectedLength);
    });

    it('countBy with less than modifier should return 0 if not found', async () => {
        const count = await repo.countByValueLessThan(0);

        expect(count).toBe(0);
    });

    it('deleteAllBy with less than modifier should delete entities', async () => {

        const expectedLength = testEntities.filter((entity) => entity.value < 10).length;
        const result = await repo.deleteAllByValueLessThan(10);
        const entities = await repo.findAllByValueLessThan(10);

        expect(result).toBe(expectedLength);
        expect(entities.length).toBe(0);

        await resetCollection();
    });

    it('deleteAllBy with less than modifier should return 0 if not found', async () => {
        const result = await repo.deleteAllByValueLessThan(0);

        expect(result).toBe(0);
    });

    it('updateBy with less than modifier should update entities', async () => {
        const update = {
            value: 200
        };
        const expected = testEntities.filter((entity) => entity.value < 10).length;

        await repo.updateByValueLessThan(10, update);
        const updated = await repo.findAllByValue(update.value);

        expect(updated.length).toBe(expected);
        updated.forEach((entity) => {
            expect(entity.value).toBe(update.value);
        });

        await resetCollection();
    });

    it('updateBy with less than modifier should not update if not found', async () => {
        const update = {
            value: 200
        };

        await repo.updateByValueLessThan(0, update);
        const updated = await repo.countByValue(update.value);

        expect(updated).toBe(0);

        await resetCollection();
    });

    async function resetCollection() {
        await repo.collection.deleteMany({});
        testEntities = Array.from({length: 100}, (_, i) => new LessThanTestEntity({
            name: `name-${i}`,
            value: i
        }, false));

        await repo.insertMany(testEntities);
    }
});
