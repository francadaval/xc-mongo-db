import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { testModuleFactory } from "../utils/test-module.factory";
import { TestEntityRepository } from "./repositories/base/test-entity.repository";
import { TestEntity } from "./repositories/base/test.entity";

describe('Method Builders Tests', () => {
    var app: INestApplicationContext;
    var repo: TestEntityRepository;

    const TEST_ENTITIES = [{
        name: 'test_name_0',
        value1: 1,
        value2: 1
    }, {
        name: 'test_name_1',
        value1: 2,
        value2: 2
    }, {
        name: 'test_name_2',
        value1: 2,
        value2: 4
    }, {
        name: 'test_name_3',
        value1: 2,
        value2: 4
    }];

    beforeAll(async () => {
        const testModule = testModuleFactory([TestEntityRepository]);
        app = await NestFactory.createApplicationContext(testModule);
        repo = app.get(TestEntityRepository);
        await resetCollection();
    });

    afterAll(async () => {
        app.close();
        repo.collection.drop();
    });

    it('application context should be created', async () => {
        expect(app).toBeDefined();
    });

    it('entity repository should be created', async () => {
        expect(repo).toBeDefined();
    });

    it('findOneByValue1 should return document', async () => {
        const result = await repo.findOneByValue1(1);

        expect(result).toEqual(TEST_ENTITIES[0]);
    });

    it('findOneByValue2 should return document', async () => {
        const result = await repo.findOneByValue2(1);

        expect(result).toEqual(TEST_ENTITIES[0]);
    });

    it('findAllByValue1 should return documents', async () => {
        const value1 = 2;
        const results = await repo.findAllByValue1(value1);
        const entities = TEST_ENTITIES.filter(entity => entity.value1 === value1);

        expect(results.length).toEqual(entities.length);
        entities.forEach(entity => {
            expect(results.find(result => result.name === entity.name)).toEqual(entity);
        });
    });

    it('findAllByValue2 should return documents', async () => {
        const value2 = 4;
        const results = await repo.findAllByValue2(value2);
        const entities = TEST_ENTITIES.filter(entity => entity.value2 === value2);

        expect(results.length).toEqual(entities.length);
        entities.forEach(entity => {
            expect(results.find((result) => result.name === entity.name)).toEqual(entity);
        });
    });

    it('countByValue1 should return count', async () => {
        const value1 = 2;
        const expected = TEST_ENTITIES.filter(entity => entity.value1 === value1).length;
        
        const count = await repo.countByValue1(value1);

        expect(count).toEqual(expected);
    });

    it('countByValue2 should return count', async () => {
        const value2 = 4;
        const expected = TEST_ENTITIES.filter(entity => entity.value2 === value2).length;
        
        const count = await repo.countByValue2(value2);

        expect(count).toEqual(expected);
    });

    it('deleteAllByValue1 should delete documents', async () => {
        const value1 = 2;
        const expected = TEST_ENTITIES.filter(entity => entity.value1 === value1).length;
        
        const deleted = await repo.deleteAllByValue1(value1);
        
        expect(deleted).toEqual(expected);
        const results = await repo.findAllByValue1(value1);
        expect(results.length).toEqual(0);
        
        await resetCollection();
    });

    it('deleteAllByValue2 should delete documents', async () => {
        const value2 = 4;
        const expected = TEST_ENTITIES.filter(entity => entity.value2 === value2).length;
        
        const deleted = await repo.deleteAllByValue2(value2);
        
        expect(deleted).toEqual(expected);
        const results = await repo.findAllByValue2(value2);
        expect(results.length).toEqual(0);

        await resetCollection();
    });

    it('updateByValue1 should update documents', async () => {
        const value1 = 2;
        const update = { value2: 3 };
        const updatedEntities = TEST_ENTITIES.filter(entity => entity.value1 === value1);

        await repo.updateByValue1(value1, update);
        const results = await repo.findAllByValue1(value1);
        
        expect(results.length).toEqual(updatedEntities.length);
        updatedEntities.forEach(entity => {
            const result = results.find(result => result.name === entity.name);
            expect(result.value2).toEqual(update.value2);
        });
        
        await resetCollection();
    });

    it('updateByValue2 should update documents', async () => {
        const value2 = 4;
        const update = { value1: 3 };
        const updatedEntities = TEST_ENTITIES.filter(entity => entity.value2 === value2);

        await repo.updateByValue2(value2, update);
        const results = await repo.findAllByValue2(value2);
        
        expect(results.length).toEqual(updatedEntities.length);
        updatedEntities.forEach(entity => {
            const result = results.find(result => result.name === entity.name);
            expect(result.value1).toEqual(update.value1);
        });
        
        await resetCollection();
    });

    async function resetCollection() {
        await repo.deleteAll();
        await repo.insertMany(TEST_ENTITIES.map(entity => new TestEntity(entity, false)));
    }   
});

// TODO: Failing tests
// * findOneByName can not be declared if name is @Id
// * findOneByValue3 can not be declared if value3 is not @Property
