import { NestFactory } from "@nestjs/core";
import { TestModule } from "./e2e-tests/test-module";
import { TestRepo } from "./e2e-tests/test-repo";
import { TestRepo2 } from "./e2e-tests/test-repo-2";
import { INestApplicationContext, Logger } from "@nestjs/common";
import { ExtendedEntityRepository } from "./e2e-tests/extended-entity-repo";
import { TestEntity2 } from "./e2e-tests/test-entity-2";
import { TestEntity } from "./e2e-tests/test-entity";
import { TestSubEntity } from "./e2e-tests/test-sub-entity";

const logger = new Logger("Main");
const RUN_TEST1 = true;
const RUN_TEST2 = true;
const RUN_EXTENDED_TEST = true;

async function bootstrap() {
    logger.log("Start tests!!");
    const testApp = await NestFactory.createApplicationContext(TestModule);
    logger.log("Application context created.");

    if(RUN_TEST1) {
        logger.log("Run Test1");
        await repo1Tests(testApp);
    }

    if(RUN_TEST2) {
        logger.log("Run Test2");
        await repo2Tests(testApp);
    }

    if(RUN_EXTENDED_TEST) {
        logger.log("Run Extended Test")
        await extendedRepoTest(testApp);
    }

    process.exit();
}

async function extendedRepoTest(appContext: INestApplicationContext) {
    let extendedRepo = appContext.get(ExtendedEntityRepository);
    extendedRepo.findOneByValue(14);
}

async function repo1Tests(appContext: INestApplicationContext) {
    let testRepo = appContext.get(TestRepo);

    await testRepo.deleteAll();

    let entity = new TestEntity();
    entity.name = "Test entity";
    entity.value = 42;
    entity.date = new Date();
    entity.lockAndStock = 16;
    entity.subEntity = new TestSubEntity({
        name: "Test subentity",
        value: 13
    });

    await testRepo.insertOne(entity);

    try {
        let test1_1 = await testRepo.findOneByValue(40);
        let test1_2_count = await testRepo.countBySubEntityValue(13);
        let test1_3 = await testRepo.findOneByLockAndStockAndValueGreaterThan(16, 40);

        logger.log(`test1: ${test1_1?'exist':'doesn\'t exist'}`);
        logger.log(`test1_2_count: ${test1_2_count}`);
        logger.log(`test1_3: ${test1_3.name}`);
    } catch (err) {
        logger.error(err);
    }

    await testRepo.updateByValue(42, {
        subEntity: {
            name: "Updated subentity",
            value: 77
        }
    });

    try {
        let count1_4 = await testRepo.countBySubEntityValue(77);
        logger.log(`count1_4: ${count1_4}`);
    } catch (err) {
        logger.error(err);
    }
}

async function repo2Tests(appContext: INestApplicationContext) {
    let testRepo2 = appContext.get(TestRepo2);

    await testRepo2.deleteAll();

    let entity = new TestEntity2();
    entity.name = "Test entity 2";
    entity.value1 = 16;
    entity.value2 = 17;
    entity.date = new Date();

    await testRepo2.insertOne(entity);

    try {
        let test2_1 = await testRepo2.findOneByValue1(16);
        let test2_2 = await testRepo2.findOneByValue2(17);
        let count16 = await testRepo2.countByValue1(16);
        let count77 = await testRepo2.countByValue1(77);
        let entities = await testRepo2.findAllByValue1AndValue2(16, 17);
        let page = await testRepo2.findPageByValue1(16, {
            page_index: 0,
            page_size: 5
        })
        let page2 = await testRepo2.findPageByValue1(16, {
            page_index: 30,
            page_size: 5
        })

        await testRepo2.deleteAllByValue1(16);
        let count16_b = await testRepo2.countByValue1(16);

        logger.log(`test2_1: ${test2_1?'exist':'doesn\'t exist'}`);
        logger.log(`test2_2: ${test2_2?'exist':'doesn\'t exist'}`);
        logger.log(`count16 = ${count16}`);
        logger.log(`count16_b = ${count16_b}`);
        logger.log(`count77 = ${count77}`);
        logger.log(`entities.length = ${entities.length}`);

        logger.log(`page.page_size = ${page.page_size}`);
        logger.log(`page.items.length = ${page.items.length}`);
        logger.log(`page.total_size = ${page.total_size}`);
        logger.log(`page.page_index = ${page.page_index}`);

        logger.log(`page2.page_size = ${page2.page_size}`);
        logger.log(`page2.items.length = ${page2.items.length}`);
        logger.log(`page2.total_size = ${page2.total_size}`);
        logger.log(`page2.page_index = ${page2.page_index}`);
    } catch (err) {
        logger.error(err);
    }
}

bootstrap();
