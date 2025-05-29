import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { compare } from 'bcrypt';
import { MongoServerError } from "mongodb";

import { testModuleFactory } from "../utils/test-module.factory";
import { PropertiesTestEntityRepository } from "./repositories/properties/properties-test-entity.repository";
import { PropertiesTestEntity, VALUE_DEFAULT } from "./repositories/properties/properties-test.entity";

const TEST_ENTITY_JSON = {
    name: 'test_name',
    password: 'test_password',
    uniqueValue: 42,
    value: 1,
    nonExistent: 'non_test',
    value1: 2
};

const TEST_ENTITY_JSON_UNIQUE = {
    name: 'test_name_unique',
    password: 'test_password_unique',
    uniqueValue: 43,
    value: 1
};

const TEST_ENTITY_JSON_DEFAULT = {
    name: 'test_name_default',
    password: 'test_password_default',
    uniqueValue: 44
}

const TEST_ENTITY_JSON_NON_DEFAULT = {
    name: 'test_name_non_default',
    password: 'test_password_non_default',
    uniqueValue: 45,
    value: 200
}

describe('Property Decorator Tests', () => {
    
    let app: INestApplicationContext;
    let repo: PropertiesTestEntityRepository;
    let test_entity: PropertiesTestEntity;
    
    beforeAll(async () => {
        const testModule = testModuleFactory([PropertiesTestEntityRepository]);
        app = await NestFactory.createApplicationContext(testModule);
        repo = app.get(PropertiesTestEntityRepository);
        test_entity = new PropertiesTestEntity();
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

    it('entity id should return name', async () => {
        test_entity.fromJson(TEST_ENTITY_JSON);

        expect(test_entity._id).toBe(TEST_ENTITY_JSON.name);
    });

    it('entity password should be hashed', async () => {
        const doc = test_entity.toDoc();

        expect(doc.password).not.toBe(TEST_ENTITY_JSON.password);
    });

    it('entity should not have nonExistent property', async () => {
        const doc = test_entity.toDoc();

        expect(doc.nonExistent).toBeUndefined();
    });

    it('repository should save entity', async () => {
        await repo.insertOne(test_entity);

        const saved_entity = await repo.findOne(TEST_ENTITY_JSON.name);

        expect(saved_entity).toBeDefined();
        expect(saved_entity._id).toBe(TEST_ENTITY_JSON.name);
        expect(saved_entity.name).toBe(TEST_ENTITY_JSON.name);
    });

    it('indexes on collection should be created', async () => {
        const indexes = await repo.collection.indexes();
        const value_1 = indexes.filter((index: any) => index.name === 'value_1');
        const uniqueValue_1 = indexes.filter((index: any) => index.name === 'uniqueValue_1');

        expect(value_1).toBeDefined();
        expect(uniqueValue_1).toBeDefined();
    });

    it('saved entity password should be hashed', async () => {
        const saved_entity = await repo.findOne(TEST_ENTITY_JSON.name);

        expect(saved_entity.password).not.toBe(TEST_ENTITY_JSON.password);
        const pass_check = await compare(TEST_ENTITY_JSON.password, saved_entity.password);
        expect(pass_check).toBe(true);
    });

    it('property name for value1 should be value_1 in DB document', async () => {
        const doc = test_entity.toDoc();
        const saved_entity = await repo.findOne(TEST_ENTITY_JSON.name);

        expect(doc.value_1).toBe(TEST_ENTITY_JSON.value1);
        expect(doc.value1).toBeUndefined();
        expect(saved_entity.value1).toBe(TEST_ENTITY_JSON.value1);
    });

    it('modify entity name should update id', async () => {
        test_entity.name = 'new_name';

        expect(test_entity._id).toBe('new_name');
    });

    it('trying to save duplicate unique value should throw error', async () => {
        const test_entity_unique = new PropertiesTestEntity(TEST_ENTITY_JSON_UNIQUE, false);
        const test_entity_unique2 = new PropertiesTestEntity(TEST_ENTITY_JSON_UNIQUE, false);
        test_entity_unique2.name += '2';

        await repo.insertOne(test_entity_unique);

        expect(async () => {
            await repo.insertOne(test_entity_unique2);
        }).rejects.toThrow(MongoServerError);
    });

    it('default value should be set', async () => {
        const test_entity_default = new PropertiesTestEntity();
        test_entity_default.fromJson(TEST_ENTITY_JSON_DEFAULT);

        await repo.insertOne(test_entity_default);

        const saved_entity = await repo.findOne(test_entity_default.name);

        expect(saved_entity.value).toBe(VALUE_DEFAULT);
    });

    // TODO: Check the default value is applied on entity creation but not on update
    it('default value should not be set on update', async () => {
        const test_entity_non_default = new PropertiesTestEntity(TEST_ENTITY_JSON_NON_DEFAULT, false);
        const new_value1 = 120;
        await repo.insertOne(test_entity_non_default);

        await repo.updateOne(test_entity_non_default._id, {value1: new_value1});

        const saved_entity = await repo.findOne(test_entity_non_default.name);

        expect(saved_entity.value).toBe(TEST_ENTITY_JSON_NON_DEFAULT.value);
        expect(saved_entity.value).not.toBe(VALUE_DEFAULT);
        expect(saved_entity.value1).toBe(new_value1);
    });
});
