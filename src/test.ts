import { NestFactory } from "@nestjs/core";
import { TestModule } from "./tests/test-module";
import { TestRepo } from "./tests/test-repo";
import { TestRepo2 } from "./tests/test-repo-2";
import { Logger } from "@nestjs/common";
import { TestEntity } from "./tests/test-entity";

const logger = new Logger("Main");

async function bootstrap() {
    logger.log("Start tests!!");
    const testApp = await NestFactory.createApplicationContext(TestModule);
    logger.log("Application context created.");

    let testRepo = testApp.get(TestRepo);

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

    let testRepo2 = testApp.get(TestRepo2);
    await testRepo2.insertOne({
        name: "Test entity 2",
        value1: 16,
        value2: 17,
        date: new Date()
    });

    try {
        let test1_1 = await testRepo.findOneByValue(40);
        let test1_2_count = await testRepo.countBySubEntityValue(13);
        let test1_3 = await testRepo.findOneByLockAndStockAndValueGreaterThan(16, 42);

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


        logger.log(`test1: ${test1_1?'exist':'doesn\'t exist'}`);
        logger.log(`test1_2_count: ${test1_2_count}`);
        logger.log(`test1_3: ${test1_3.name}`);
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

    process.exit();
}

bootstrap();
