import { NestFactory } from "@nestjs/core";
import { TestModule } from "./tests/test-module";
import { TestRepo } from "./tests/test-repo";

async function bootstrap() {
    const testApp = await NestFactory.createApplicationContext(TestModule);
    testApp.get(TestRepo).insertOne({
        name: "Test entity",
        value: 42,
        date: new Date()
    });
}

bootstrap();
