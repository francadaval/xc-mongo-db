import { INestApplicationContext } from "@nestjs/common";
import { SimpleTestEntity } from "./test-module/simple-test.entity";
import { NestFactory } from "@nestjs/core";
import { TestModule } from "./test-module/test.module";
import { BaseEntity } from "@src/entity";

describe('BaseEntity Tests', () => {
    
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

    it('entity should be created', async () => {
        const entity = new SimpleTestEntity();

        expect(entity).toBeDefined();
    });

    it('toDoc should be overriden and return plain object document', async () => {
        const entity = new SimpleTestEntity();
        entity.name = 'Test Entity';
        entity.value = 42;

        const doc = entity.toDoc();

        expect(doc).toBeDefined();
        expect(doc.name).toEqual(entity.name);
        expect(doc.value).toEqual(entity.value);
        expect(doc instanceof SimpleTestEntity).toBeFalsy();
        expect(doc instanceof BaseEntity).toBeFalsy();
        expect(doc instanceof Object).toBeTruthy();
    });

    it('fromJson should be overriden and populate entity from plain object like entity', async () => {
        const entity = new SimpleTestEntity();
        const doc = {
            name: 'Test Entity',
            value: 42
        };

        entity.fromJson(doc);

        expect(entity.name).toEqual(doc.name);
        expect(entity.value).toEqual(doc.value);
    });

    it('fromJson should be overriden and populate entity from another entity instance', async () => {
        const entity = new SimpleTestEntity();
        const doc = {
            name: 'Test Entity',
            value: 42
        };
        entity.fromJson(doc);

        const entity2 = new SimpleTestEntity();
        entity2.fromJson(entity);

        expect(entity2.name).toEqual(entity.name);
        expect(entity2.value).toEqual(entity.value);
    });

    it('fromDoc should be overriden and populate entity from plain object document', async () => {
        const entity = new SimpleTestEntity();
        const doc = {
            name: 'Test Entity',
            value: 42
        };

        entity.fromDoc(doc);

        expect(entity.name).toEqual(doc.name);
        expect(entity.value).toEqual(doc.value);
    });
});
