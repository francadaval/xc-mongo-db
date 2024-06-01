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
    let testEntity = new TestEntity();

    await testRepo.insertOne({
        name: "Test entity",
        value: 42,
        date: new Date()
    });

    let testRepo2 = testApp.get(TestRepo2);
    await testRepo2.insertOne({
        name: "Test entity 2",
        value1: 16,
        value2: 17,
        date: new Date()
    });

    try {
        let test1 = await testRepo.findOneByValue(40);
        let test2_1 = await testRepo2.findOneByValue1(16);
        let test2_2 = await testRepo2.findOneByValue2(17);
        let count16 = await testRepo2.countByValue1(16);
        let count77 = await testRepo2.countByValue1(77);

        logger.log(`test1: ${test1?'exist':'doesn\'t exist'}`);
        logger.log(`test2_1: ${test2_1?'exist':'doesn\'t exist'}`);
        logger.log(`test2_2: ${test2_2?'exist':'doesn\'t exist'}`);
        logger.log(`count16 = ${count16}`);
        logger.log(`count77 = ${count77}`);
    } catch (err) {
        logger.error(err);
    }

    process.exit();
}

bootstrap();
