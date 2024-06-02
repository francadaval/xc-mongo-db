import { EntityProperties } from "../../decorators";
import { MethodNameParser, ParsedMethodGroup } from "./method-name-parser";
import { Injectable, Logger } from "@nestjs/common";
import { MethodBuilder } from "../method-builders/method-builder";

const logger = new Logger("RepoMethodsbuilder");

@Injectable()
export class RepositoryMethodsBuilder {
    private builders: {
        [verb: string]: MethodBuilder
    } = {};
    private logger = new Logger(RepositoryMethodsBuilder.name);

    registerBuilder(builder: MethodBuilder) {
        let verb = builder.getVerb();
        if(this.builders[verb]) {
            this.throwError(`Builder for '${verb}' already exist.`)
        } else {
            this.logger.log(`Builder registered for ${verb}.`);
            this.builders[verb] = builder;
        }
    }

    buildRepositoryMethod(methodName: string, propertiesNames: string[]): ((...args: any[]) => PromiseLike<any>) {
        let parser = new MethodNameParser(Object.keys(this.builders), methodName, propertiesNames);
        let verb = parser.getVerb();

        let builder = this.builders[verb];

        if(!builder) {
            throw new Error(`MethodBuilder not found for ${verb}!`);
        }

        return builder.buildFuction(methodName, parser.getMatchedGroups());
    }

    private throwError(message: string) {
        this.logger.error(message);
        throw new Error(message);
    }
}
