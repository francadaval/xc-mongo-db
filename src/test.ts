import { NestFactory } from "@nestjs/core";
import { TestModule } from "./tests/test-module";
import { TestRepo } from "./tests/test-repo";
import { TestRepo2 } from "./tests/test-repo-2";

async function bootstrap() {
    const testApp = await NestFactory.createApplicationContext(TestModule);

    testApp.get(TestRepo).insertOne({
        name: "Test entity",
        value: 42,
        date: new Date()
    });

    testApp.get(TestRepo2).insertOne({
        name: "Test entity 2",
        value1: 16,
        value2: 17,
        date: new Date()
    })
}

bootstrap();
