import { NestFactory } from "@nestjs/core";
import { INestApplicationContext } from "@nestjs/common";
import { ObjectId } from "mongodb";

import { TestModule } from "./test-module/test.module";
import { BaseTestEntityRepository } from "./test-module/base/base-test-entity.repository";
import { BaseTestEntity } from "./test-module/base/base-test.entity";

const TEST_ENTITY_JSON = {
    name: 'Test Entity',
    value: 42,
    tags: ['tag1', 'tag2', 'tag3'],
    date: new Date()
};

describe('BaseRepository Tests', () => {

    let app: INestApplicationContext;
    let repo: BaseTestEntityRepository;
    let entity_id: ObjectId;

    beforeAll(async () => {
        app = await NestFactory.createApplicationContext(TestModule);
        repo = app.get(BaseTestEntityRepository);
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

    it('collection should be created', async () => {
        const collection = await repo.collection;

        expect(collection).toBeDefined();
    });

    it('insertOne should insert entity and rerturn id', async () => {
        const entity = new BaseTestEntity();
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
        const entity1 = new BaseTestEntity();
        entity1.fromJson(TEST_ENTITY_JSON);

        const entity2 = new BaseTestEntity();
        entity2.fromJson(TEST_ENTITY_JSON);

        const ids = await repo.insertMany([entity1, entity2]);

        expect(ids.length).toEqual(2);
        expect(ids[0]).toBeDefined();
        expect(ids[1]).toBeDefined();
    });

        
    it('array property should be saved', async () => {
        const saved_entity = await repo.findOne(entity_id);

        expect(saved_entity.tags).toEqual(TEST_ENTITY_JSON.tags);
    });


    it('array property should be updated', async () => {
        const tags = ['tag1', 'tag2'];

        await repo.updateOne(entity_id, {tags});

        const saved_entity = await repo.findOne(entity_id);

        expect(saved_entity.tags).toEqual(tags);
    })

    it('date property should be saved', async () => {
        const saved_entity = await repo.findOne(entity_id); 

        expect(saved_entity.date).toEqual(TEST_ENTITY_JSON.date);
    });

    it('date property should be updated', async () => {
        const date = new Date();

        await repo.updateOne(entity_id, {date});

        const saved_entity = await repo.findOne(entity_id);

        expect(saved_entity.date).toEqual(date);
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
