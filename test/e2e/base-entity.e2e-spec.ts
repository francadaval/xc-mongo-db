import { INestApplicationContext } from "@nestjs/common";
import { BaseTestEntity } from "./test-module/base/base-test.entity";
import { NestFactory } from "@nestjs/core";
import { TestModule } from "./test-module/test.module";
import { BaseEntity } from "@src/entity";

describe('BaseEntity Tests', () => {
    const BASE_ENTITY_JSON = {
        name: 'Test Entity',
        value: 42,
        tags: ['tag1', 'tag2', 'tag3'],
        date: new Date(),
        noStored: 'noStored',
        unknown: 'unknown'
    };

    const BASE_ENTITY_DOC = {
        name: 'Test Entity',
        value: 42,
        tags: ['tag1', 'tag2', 'tag3'],
        date: new Date(),
        unknown: 'unknown'
    };

    let app: INestApplicationContext;

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
    });

    afterAll(async () => {
        app.close();
    });

    it('application context should be created', async () => {
        expect(app).toBeDefined();
    });

    it('toDoc should be overriden and return plain object document', async () => {
        const entity = new BaseTestEntity(BASE_ENTITY_JSON, false);

        const doc = entity.toDoc();

        expect(doc).toBeDefined();
        expect(doc.name).toEqual(entity.name);
        expect(doc.value).toEqual(entity.value);
        expect(doc instanceof BaseTestEntity).toBeFalsy();
        expect(doc instanceof BaseEntity).toBeFalsy();
        expect(doc instanceof Object).toBeTruthy();
    });

    it('fromJson should be overriden and populate entity from plain object like entity', async () => {
        const entity = new BaseTestEntity();

        entity.fromJson(BASE_ENTITY_JSON);

        expect(entity.name).toEqual(BASE_ENTITY_JSON.name);
        expect(entity.value).toEqual(BASE_ENTITY_JSON.value);
    });

    it('fromJson should be overriden and populate entity from another entity instance', async () => {
        const entity = new BaseTestEntity();
        entity.fromJson(BASE_ENTITY_JSON);

        const entity2 = new BaseTestEntity();
        entity2.fromJson(entity);

        expect(entity2.name).toEqual(entity.name);
        expect(entity2.value).toEqual(entity.value);
    });

    it('fromDoc should be overriden and populate entity from plain object document', async () => {
        const entity = new BaseTestEntity();

        entity.fromDoc(BASE_ENTITY_DOC);

        expect(entity.name).toEqual(BASE_ENTITY_DOC.name);
        expect(entity.value).toEqual(BASE_ENTITY_DOC.value);
    });

    it('noStored property from JSON should not populate to document', async () => {
        const entity = new BaseTestEntity(BASE_ENTITY_JSON, false);

        const doc = entity.toDoc();

        expect(entity.noStored).toBeDefined();
        expect(doc.noStored).toBeUndefined();
    });

    it('unknown property from JSON should not populate to document', async () => {
        const entity = new BaseTestEntity(BASE_ENTITY_JSON, false);

        const doc = entity.toDoc();

        expect((entity as any).unknown).toBeDefined();
        expect(doc.unknown).toBeUndefined();
    });

    it('unknown property from document should not populate to entity', async () => {
        const entity = new BaseTestEntity(BASE_ENTITY_DOC);

        expect((entity as any).unknown).toBeUndefined();
    });
});
