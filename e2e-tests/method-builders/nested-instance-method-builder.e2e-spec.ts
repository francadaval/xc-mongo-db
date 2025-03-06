import { INestApplicationContext } from "@nestjs/common";
import { NestedTestEntityRepository } from "./test-module/nested/nested-test-entity.repository";
import { TestModule } from "./test-module/test.module";
import { NestFactory } from "@nestjs/core";
import { NestingTestEntity } from "./test-module/nested/nesting-test.entity";

const ENTITY_1 = {
    name: 'entity_name',
    nestedValue2: 1,
    nested: {
        name: 'nested_name',
        value: 1,
        value2: 0
    }
};

const ENTITY_2 = {
    name: 'entity_name_2',
    nestedValue2: 0,
    nested: {
        name: 'nested_name_2_3',
        value: 1,
        value2: 1
    }
};

const ENTITY_3 = {
    name: 'entity_name_3',
    nestedValue2: 0,
    nested: {
        name: 'nested_name_2_3',
        value: 1,
        value2: 1
    }
};

const ENTITIES = [ENTITY_1, ENTITY_2, ENTITY_3];

describe('Nested instance - Method Builders Tests', () => {
    var app: INestApplicationContext;
    var repo: NestedTestEntityRepository;

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(NestedTestEntityRepository);
        await resetCollection();
    })

    afterAll(async () => {
        app.close();
        repo.collection.drop();
    })

    it('application context should be created', async () => {
        expect(app).toBeDefined();
    });

    it('entity repository should be created', async () => {
        expect(repo).toBeDefined();
    });

    it('findOneByNestedValue should return document', async () => {
        const result = await repo.findOneByNestedValue(ENTITY_1.nested.value);

        expect(result.name).toBe(ENTITY_1.name);
        expect(result.nested.name).toBe(ENTITY_1.nested.name);
        expect(result.nested.value).toBe(ENTITY_1.nested.value);
    });

    it('findOneByNestedName should return document', async () => {
        const result = await repo.findOneByNestedName(ENTITY_1.nested.name);

        expect(result.name).toBe(ENTITY_1.name);
        expect(result.nested.name).toBe(ENTITY_1.nested.name);
        expect(result.nested.value).toBe(ENTITY_1.nested.value);
    });    

    it('findOneByNestedValue2 should return result for main entity property "nestedValue2"', async () => {
        const nestedValue2 = ENTITY_1.nestedValue2;

        const result = await repo.findOneByNestedValue2(nestedValue2);

        expect(result.name).toBe(ENTITY_1.name);
        expect(result.nestedValue2).toBe(nestedValue2);
    });

    it('findAllByNestedName should return documents', async () => {
        const nestedName = ENTITY_2.nested.name;
        const result = await repo.findAllByNestedName(nestedName);
        const expectedLength = ENTITIES.filter((entity) => entity.nested.name === nestedName).length;

        expect(result.length).toBe(expectedLength);
        result.forEach((entity) => {
            expect(entity.nested.name).toBe(nestedName);
        });
    });

    it('findAllByNestedValue should return documents', async () => {
        const nestedValue = ENTITY_1.nested.value;
        const result = await repo.findAllByNestedValue(nestedValue);
        const expectedLength = ENTITIES.filter((entity) => entity.nested.value === 1).length;

        expect(result.length).toBe(expectedLength);
        result.forEach((entity) => {
            expect(entity.nested.value).toBe(nestedValue);
        });
    });

    it('findAllByNestedValue2 should return results for main entity property "nestedValue2"', async () => {
        const nestedValue2 = ENTITY_2.nestedValue2;
        const result = await repo.findAllByNestedValue2(nestedValue2);
        const expectedLength = ENTITIES.filter((entity) => entity.nestedValue2 === nestedValue2).length;

        expect(result.length).toBe(expectedLength);
        result.forEach((entity) => {
            expect(entity.nestedValue2).toBe(nestedValue2);
            expect(entity.nested.value2).not.toBe(nestedValue2);
        });
    });

    it('countByNestedName should return count', async () => {
        const nestedName = ENTITY_2.nested.name;
        const expected = ENTITIES.filter((entity) => entity.nested.name === nestedName).length;
        const count = await repo.countByNestedName(nestedName);

        expect(count).toBe(expected);
    });

    it('countByNestedValue should return count', async () => {
        const nestedValue = ENTITY_1.nested.value;
        const expected = ENTITIES.filter((entity) => entity.nested.value === nestedValue).length;
        const count = await repo.countByNestedValue(nestedValue);

        expect(count).toBe(expected);
    });

    it('countByNestedValue2 should return count for main entity property "nestedValue2"', async () => {
        const nestedValue2 = ENTITY_2.nestedValue2;
        const expected = ENTITIES.filter((entity) => entity.nestedValue2 === nestedValue2).length;
        const count = await repo.countByNestedValue2(nestedValue2);

        expect(count).toBe(expected);
    });

    it('deleteAllByNestedName should delete documents', async () => {
        const nestedName = ENTITY_2.nested.name;
        const expected = ENTITIES.filter((entity) => entity.nested.name === nestedName).length;

        const deleted = await repo.deleteAllByNestedName(nestedName);

        expect(deleted).toBe(expected);
        const result = await repo.findAllByNestedName(nestedName);
        expect(result.length).toBe(0);

        await resetCollection();
    });

    it('deleteAllByNestedValue should delete documents', async () => {
        const nestedValue = ENTITY_1.nested.value;
        const expected = ENTITIES.filter((entity) => entity.nested.value === nestedValue).length;

        const deleted = await repo.deleteAllByNestedValue(nestedValue);

        expect(deleted).toBe(expected);
        const result = await repo.findAllByNestedValue(nestedValue);
        expect(result.length).toBe(0);

        await resetCollection();
    });

    it('deleteAllByNestedValue2 should delete documents for main entity property "nestedValue2"', async () => {
        const nestedValue2 = ENTITY_2.nestedValue2;
        const expected = ENTITIES.filter((entity) => entity.nestedValue2 === nestedValue2).length;

        const deleted = await repo.deleteAllByNestedValue2(nestedValue2);

        expect(deleted).toBe(expected);
        const result = await repo.findAllByNestedValue2(nestedValue2);
        expect(result.length).toBe(0);

        await resetCollection();
    });

    it('updateByNestedName should update documents', async () => {
        const nestedName = ENTITY_2.nested.name;
        const update = {
            nested: {
                name: 'new_nested_name',
                value: 12
            }
        }

        await repo.updateByNestedName(nestedName, update as Partial<NestingTestEntity>);
        const result = await repo.findAllByNestedName(update.nested.name);

        expect(result.length).toBe(ENTITIES.filter((entity) => entity.nested.name === nestedName).length);
        result.forEach((entity) => {
            expect(entity.nested).toEqual(update.nested);
        });

        await resetCollection();
    });

    it('updateByNestedValue should update documents', async () => {
        const nestedValue = ENTITY_1.nested.value;
        const update = {
            nested: {
                name: 'new_nested_name',
                value: 12
            }
        }

        await repo.updateByNestedValue(nestedValue, update as Partial<NestingTestEntity>);
        const result = await repo.findAllByNestedValue(update.nested.value);

        expect(result.length).toBe(ENTITIES.filter((entity) => entity.nested.value === nestedValue).length);
        result.forEach((entity) => {
            expect(entity.nested).toEqual(update.nested);
        });

        await resetCollection();
    });

    it('updateByNestedValue2 should update documents for main entity property "nestedValue2"', async () => {
        const nestedValue2 = ENTITY_2.nestedValue2;
        const update = {
            nested: {
                name: 'new_nested_name',
                value: 12
            }
        }

        await repo.updateByNestedValue2(nestedValue2, update as Partial<NestingTestEntity>);
        const result = await repo.findAllByNestedValue2(nestedValue2);

        expect(result.length).toBe(ENTITIES.filter((entity) => entity.nestedValue2 === nestedValue2).length);
        result.forEach((entity) => {
            expect(entity.nested).toEqual(update.nested);
        });

        await resetCollection();
    });

    async function resetCollection() {
        await repo.collection.deleteMany({});

        let entities = ENTITIES.map((entity) => new NestingTestEntity(entity, false));
        await repo.insertMany(entities);
    }
});
