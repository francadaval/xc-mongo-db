import { INestApplicationContext } from "@nestjs/common";
import { ArrayFilterTestRepository } from "./test-module/repositories/array-filter-test.repository";
import { ArrayFilterTestEntity } from "./test-module/repositories/array-filter-test.entity";
import { TestModule } from "./test-module/test.module";
import { NestFactory } from "@nestjs/core";

describe('Array Filter Modifiers', () => {

    const SAMPLE_LIST_VALUES = [1, 2, 3, 4];
    const SAMPLE_LIST_VALUES_NOT_FOUND = [11, 12, 13, 14, 15, 16];
    const SAMPLE_LIST_VALUES_MIXED = [1, 2, 15, 16];

    let app: INestApplicationContext;
    let repo: ArrayFilterTestRepository;
    let testEntities: ArrayFilterTestEntity[];

    beforeEach(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(ArrayFilterTestRepository);
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

    it('findOneByValueIn should return value', async () => {
        const entity = await repo.findOneByValueIn(SAMPLE_LIST_VALUES);

        expect(SAMPLE_LIST_VALUES).toContain(entity.value);
    });

    it('findOneByValueIn should return null when not found', async () => {
        const entity = await repo.findOneByValueIn(SAMPLE_LIST_VALUES_NOT_FOUND);

        expect(entity).toBeNull();
    });

    it('findAllByValueIn should return values', async () => {
        const entities = await repo.findAllByValueIn(SAMPLE_LIST_VALUES);
        const expectedLength = testEntities.filter(e => SAMPLE_LIST_VALUES.includes(e.value)).length;

        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            expect(SAMPLE_LIST_VALUES).toContain(entity.value);
        });
    });

    it('findAllByValueIn should return empty array when not found', async () => {
        const entities = await repo.findAllByValueIn(SAMPLE_LIST_VALUES_NOT_FOUND);

        expect(entities).toHaveLength(0);
    });

    it('countByValueIn should return count', async () => {
        const values = [1, 2, 3, 4];
        const count = await repo.countByValueIn(values);
        const expectedCount = testEntities.filter(e => values.includes(e.value)).length;

        expect(count).toBe(expectedCount);
    });

    it('countByValueIn should return 0 when not found', async () => {
        const count = await repo.countByValueIn(SAMPLE_LIST_VALUES_NOT_FOUND);

        expect(count).toBe(0);
    });

    it('deleteAllByValueIn should delete values', async () => {
        const values = [1, 2, 3, 4];
        const expected = testEntities.filter(e => values.includes(e.value)).length;
        
        const deleted = await repo.deleteAllByValueIn(values);

        expect(deleted).toBe(expected);
        const count = await repo.countByValueIn(values);
        expect(count).toBe(0);

        await resetCollection();
    });

    it('deleteAllByValueIn should return 0 when not found', async () => {
        const deleted = await repo.deleteAllByValueIn(SAMPLE_LIST_VALUES_NOT_FOUND);

        expect(deleted).toBe(0);
    });

    it('updateByValueIn should update values', async () => {
        const update = { list: [] };
        const expectedLength = testEntities.filter(e => SAMPLE_LIST_VALUES.includes(e.value)).length;


        await repo.updateByValueIn(SAMPLE_LIST_VALUES, update);

        const entities = await repo.findAllByValueIn(SAMPLE_LIST_VALUES);
        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            expect(entity.list).toEqual([]);
        });

        await resetCollection();
    });

    it('updateByValueIn should update none when not found', async () => {
        const update = { value: 101 };

        await repo.updateByValueIn(SAMPLE_LIST_VALUES_NOT_FOUND, update);

        const entities = await repo.findAllByValueIn([101]);
        expect(entities).toHaveLength(0);
    });

    it('findOneByList should return value', async () => {
        const value = 3;
        const entity = await repo.findOneByList(value);

        expect(entity.list).toContain(value);
    });

    it('findOneByList should return null when not found', async () => {
        const entity = await repo.findOneByList(11);

        expect(entity).toBeNull();
    });

    it('findAllByList should return values', async () => {
        const value = 3;
        const entities = await repo.findAllByList(value);
        const expectedLength = testEntities.filter(e => e.list.includes(value)).length;

        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            expect(entity.list).toContain(value);
        });
    });

    it('findAllByList should return empty array when not found', async () => {
        const entities = await repo.findAllByList(11);

        expect(entities).toHaveLength(0);
    });

    it('countByList should return count', async () => {
        const value = 3;
        const expectedCount = testEntities.filter(e => e.list.includes(value)).length;
        
        const count = await repo.countByList(value);

        expect(count).toBe(expectedCount);
    });

    it('countByList should return 0 when not found', async () => {
        const count = await repo.countByList(11);

        expect(count).toBe(0);
    });

    it('deleteAllByList should delete values', async () => {
        const value = 3;
        const expected = testEntities.filter(e => e.list.includes(value)).length;
        
        const deleted = await repo.deleteAllByList(value);

        expect(deleted).toBe(expected);
        const count = await repo.countByList(value);
        expect(count).toBe(0);

        await resetCollection();
    });

    it('deleteAllByList should return 0 when not found', async () => {
        const deleted = await repo.deleteAllByList(11);

        expect(deleted).toBe(0);
    });

    it('updateByList should update values', async () => {
        const listValue = 3;
        const newValue = 101;
        const update = { value: newValue };
        const expectedLength = testEntities.filter(e => e.list.includes(listValue)).length;

        await repo.updateByList(listValue, update);

        const entities = await repo.findAllByList(listValue);
        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            expect(entity.value).toEqual(newValue);
        });

        await resetCollection();
    });

    it('updateByList should update none when not found', async () => {
        const listValue = 11;
        const newValue = 101;
        const update = { value: newValue };

        await repo.updateByList(listValue, update);

        const entities = await repo.findAllByValueIn([newValue]);
        expect(entities).toHaveLength(0);
    });

    it('findOneByListMatchAll should return value', async () => {
        const values = SAMPLE_LIST_VALUES;
        const entity = await repo.findOneByListMatchAll(values);

        values.forEach(value => {
            expect(entity.list).toContain(value);
        });
    });

    it('findOneByListMatchAll should return null when not all match', async () => {
        const values = SAMPLE_LIST_VALUES_MIXED;

        const entity = await repo.findOneByListMatchAll(values);

        expect(entity).toBeNull();
    });

    it('findAllByListMatchAll should return values', async () => {
        const values = SAMPLE_LIST_VALUES;
        const expectedLength = testEntities.filter(e => values.every(v => e.list.includes(v))).length;
        
        const entities = await repo.findAllByListMatchAll(values);

        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            values.forEach(value => {
                expect(entity.list).toContain(value);
            });
        });
    });

    it('findAllByListMatchAll should return empty array when not all match', async () => {
        const values = SAMPLE_LIST_VALUES_MIXED;

        const entities = await repo.findAllByListMatchAll(values);

        expect(entities).toHaveLength(0);
    });

    it('countByListMatchAll should return count', async () => {
        const values = SAMPLE_LIST_VALUES;
        const expectedCount = testEntities.filter(e => values.every(v => e.list.includes(v))).length;
        
        const count = await repo.countByListMatchAll(values);

        expect(count).toBe(expectedCount);
    });

    it('countByListMatchAll should return 0 when not all match', async () => {
        const values = SAMPLE_LIST_VALUES_MIXED;

        const count = await repo.countByListMatchAll(values);

        expect(count).toBe(0);
    });

    it('deleteAllByListMatchAll should delete values', async () => {
        const values = SAMPLE_LIST_VALUES;
        const expected = testEntities.filter(e => values.every(v => e.list.includes(v))).length;
        
        const deleted = await repo.deleteAllByListMatchAll(values);

        expect(deleted).toBe(expected);
        const count = await repo.countByListMatchAll(values);
        expect(count).toBe(0);

        await resetCollection();
    });

    it('deleteAllByListMatchAll should return 0 when not all match', async () => {
        const values = SAMPLE_LIST_VALUES_MIXED;

        const deleted = await repo.deleteAllByListMatchAll(values);

        expect(deleted).toBe(0);
    });

    it('updateByListMatchAll should update values', async () => {
        const values = SAMPLE_LIST_VALUES;
        const newValue = 101;
        const update = { value: newValue };
        const expectedLength = testEntities.filter(e => values.every(v => e.list.includes(v))).length;

        await repo.updateByListMatchAll(values, update);

        const entities = await repo.findAllByListMatchAll(values);
        expect(entities).toHaveLength(expectedLength);
        entities.forEach(entity => {
            expect(entity.value).toEqual(newValue);
        });

        await resetCollection();
    });

    it('updateByListMatchAll should update none when not all match', async () => {
        const values = SAMPLE_LIST_VALUES_MIXED;
        const newValue = 101;
        const update = { value: newValue };

        await repo.updateByListMatchAll(values, update);

        const entities = await repo.findAllByValueIn([newValue]);
        expect(entities).toHaveLength(0);
    });

    async function resetCollection() {
        await repo.deleteAll();

        testEntities = Array.from({ length: 10 }, (_, i) => new ArrayFilterTestEntity({
                name: `name-${i}`,
                value: i,
                list: Array.from({ length: i }, (_, j) => j)
            })
        );
        await repo.insertMany(testEntities);
    }
});
