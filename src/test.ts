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
        testRepo2.findByValue1(12);
        testRepo2.findByValue2(56);
        testRepo.findByValue(40);
    } catch (err) {
        logger.error(err);
    }

    process.exit();
}

bootstrap();
