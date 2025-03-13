import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { testModuleFactory } from "../utils/test-module.factory";
import { NestingTestEntityRepository } from "./repositories/nesting/nesting-test-entity.repository";
import { NestingTestEntity } from "./repositories/nesting/nesting-test.entity";
import { NestedTestEntity } from "./repositories/nesting/nested.entity";

const TEST_ENTITY_JSON = {
    name: 'test_name',
    value: 42,
    nested: {
        name: 'nested_name',
        value: 43
    }
};

const TEST_ENTITY_DOC = {
    name: 'test_name',
    value: 42,
    nested: {
        name: 'nested_name',
        value: 43
    }
}

describe('Nesting Entity Tests', () => {
    let app: INestApplicationContext;
    let repo: NestingTestEntityRepository;

    beforeAll(async () => {
        const TestModule = testModuleFactory([NestingTestEntityRepository]);
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(NestingTestEntityRepository);
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

    it('nested object should be created for entity from JSON object', async () => {
        const entity = new NestingTestEntity(TEST_ENTITY_JSON, false);

        expect(entity).toBeDefined();
        expect(entity.name).toEqual(TEST_ENTITY_JSON.name);
        expect(entity.value).toEqual(TEST_ENTITY_JSON.value);
        expect(entity.nested).toBeDefined();
        expect(entity.nested instanceof NestedTestEntity).toBeTruthy();
        expect(entity.nested.name).toEqual(TEST_ENTITY_JSON.nested.name);
        expect(entity.nested.value).toEqual(TEST_ENTITY_JSON.nested.value);
    });

    it('nested object should be created for entity from document object', async () => {
        const entity = new NestingTestEntity(TEST_ENTITY_DOC);

        expect(entity).toBeDefined();
        expect(entity.name).toEqual(TEST_ENTITY_DOC.name);
        expect(entity.value).toEqual(TEST_ENTITY_DOC.value);
        expect(entity.nested).toBeDefined();
        expect(entity.nested instanceof NestedTestEntity).toBeTruthy();
        expect(entity.nested.name).toEqual(TEST_ENTITY_DOC.nested.name);
        expect(entity.nested.value).toEqual(TEST_ENTITY_DOC.nested.value);
    });

    it('nested object should be stored in database', async () => {
        const entity = new NestingTestEntity(TEST_ENTITY_JSON);

        const storedId = await repo.insertOne(entity);

        const stored = await repo.findOne(storedId);

        expect(stored).toBeDefined();
        expect(stored.name).toEqual(entity.name);
        expect(stored.value).toEqual(entity.value);
        expect(stored.nested).toBeDefined();
        expect(stored.nested instanceof NestedTestEntity).toBeTruthy();
        expect(stored.nested.name).toEqual(entity.nested.name);
        expect(stored.nested.value).toEqual(entity.nested.value);
    });

    it('nested object should be updated', async () => {
        const entity = new NestingTestEntity(TEST_ENTITY_JSON);

        const storedId = await repo.insertOne(entity);

        const partial = { nested: new NestedTestEntity({ value: 44 }, false) };

        await repo.updateOne(storedId, partial);
        
        const stored = await repo.findOne(storedId);
        
        expect(stored).toBeDefined();
        expect(stored.name).toEqual(entity.name);
        expect(stored.value).toEqual(entity.value);
        expect(stored.nested).toBeDefined();
        expect(stored.nested instanceof NestedTestEntity).toBeTruthy();
        expect(stored.nested).toEqual(partial.nested);
    });
});
