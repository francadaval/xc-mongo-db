import { NestFactory } from "@nestjs/core";
import { TestModule } from "./tests/test-module";
import { TestRepo } from "./tests/test-repo";
import { TestRepo2 } from "./tests/test-repo-2";
import { INestApplicationContext, Logger } from "@nestjs/common";
import { ExtendedEntityRepository } from "./tests/extended-entity-repo";

const logger = new Logger("Main");
const RUN_TEST1 = false;
const RUN_TEST2 = false;
const RUN_EXTENDED_TEST = true;

async function bootstrap() {
    logger.log("Start tests!!");
    const testApp = await NestFactory.createApplicationContext(TestModule);
    logger.log("Application context created.");

    if(RUN_TEST1) {
        logger.log("Run Test1");
        repo1Tests(testApp);
    }

    if(RUN_TEST2) {
        logger.log("Run Test2");
        repo2Tests(testApp);
    }

    if(RUN_EXTENDED_TEST) {
        logger.log("Run Extended Test")
        extendedRepoTest(testApp);
    }

    process.exit();
}

async function extendedRepoTest(appContext: INestApplicationContext) {
    let extendedRepo = appContext.get(ExtendedEntityRepository);
    extendedRepo.findOneByValue(14);
}

async function repo1Tests(appContext: INestApplicationContext) {
    let testRepo = appContext.get(TestRepo);

    await testRepo.insertOne({
        name: "Test entity",
        value: 42,
        date: new Date(),
        lockAndStock: 16,
        subEntity: {
            name: "Test subentity",
            value: 13
        }
    });

    await testRepo.insertOne({
        name: "Higher test entity",
        value: 45,
        date: new Date(),
        lockAndStock: 16,
        subEntity: {
            name: "Higher test subentity",
            value: 16
        }
    });

    try {
        let test1_1 = await testRepo.findOneByValue(40);
        let test1_2_count = await testRepo.countBySubEntityValue(13);
        let test1_3 = await testRepo.findOneByLockAndStockAndValueGreaterThan(16, 42);

        logger.log(`test1: ${test1_1?'exist':'doesn\'t exist'}`);
        logger.log(`test1_2_count: ${test1_2_count}`);
        logger.log(`test1_3: ${test1_3.name}`);
    } catch (err) {
        logger.error(err);
    }
}

async function repo2Tests(appContext: INestApplicationContext) {
    let testRepo2 = appContext.get(TestRepo2);
    await testRepo2.insertOne({
        name: "Test entity 2",
        value1: 16,
        value2: 17,
        date: new Date()
    });

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

        logger.log(`test2_1: ${test2_1?'exist':'doesn\'t exist'}`);
        logger.log(`test2_2: ${test2_2?'exist':'doesn\'t exist'}`);
        logger.log(`count16 = ${count16}`);
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
