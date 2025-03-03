import { NestFactory } from "@nestjs/core";
import { INestApplicationContext } from "@nestjs/common";
import { ObjectId } from "mongodb";

import { SimpleTestEntityModule } from "./simple/simple-test-entity.module";
import { SimpleTestEntityRepository } from "./simple/simple-test-entity.repository";
import { SimpleTestEntity } from "./simple/simple-test.entity";

const TEST_ENTITY_JSON = {
    name: 'Test Entity',
    value: 42
};

describe('BaseRepository Tests', () => {

    let app: INestApplicationContext;
    let repo: SimpleTestEntityRepository;
    let entity_id: ObjectId;

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(SimpleTestEntityModule);
        repo = app.get(SimpleTestEntityRepository);
    });

    afterAll(async () => {
        app.close();
    });

    it('application context should be created', async () => {
        expect(app).toBeDefined();
    });

    it('entity repository should be created', async () => {
        expect(repo).toBeDefined();
    });

    it('collection should be created', async () => {
        const collection = await repo.collection;

        expect(collection).toBeDefined();
    });

    it('insertOne should insert entity and rerturn id', async () => {
        const entity = new SimpleTestEntity();
        entity.fromJson(TEST_ENTITY_JSON);

        entity_id = await repo.insertOne(entity);

        expect(entity_id).toBeDefined();
    });

    it('findOne should find entity', async () => {
        const entity = await repo.findOne(entity_id);

        expect(entity).toBeDefined();
        expect(entity.name).toEqual(TEST_ENTITY_JSON.name);
        expect(entity.value).toEqual(TEST_ENTITY_JSON.value);
    });

    it('updateOne should update entity from partial', async () => {
        const partial = { value: 43 };
        await repo.updateOne(entity_id, partial);

        const entity = await repo.findOne(entity_id);

        expect(entity).toBeDefined();
        expect(entity.name).toEqual(TEST_ENTITY_JSON.name);
        expect(entity.value).toEqual(partial.value);
    });

    it('insertMany should insert multiple entities and return ids', async () => {
        const entity1 = new SimpleTestEntity();
        entity1.fromJson(TEST_ENTITY_JSON);

        const entity2 = new SimpleTestEntity();
        entity2.fromJson(TEST_ENTITY_JSON);

        const ids = await repo.insertMany([entity1, entity2]);

        expect(ids.length).toEqual(2);
        expect(ids[0]).toBeDefined();
        expect(ids[1]).toBeDefined();
    });

    it('deleteOne should delete entity', async () => {
        await repo.deleteOne(entity_id);

        const entity = await repo.findOne(entity_id);

        expect(entity).toBeNull();
    });

    it('deleteAll should delete all entities', async () => {
        await repo.deleteAll();

        const count = await repo.collection.countDocuments();
        
        expect(count).toEqual(0);
    });
});
