import { MethodNameParser } from "./method-name-parser";
import { MethodBuilder } from "../method-builders/method-builder";
import { FilterModifier } from "../filter-modifiers";

import { Injectable, Logger } from "@nestjs/common";

const logger = new Logger("RepoMethodsbuilder");

@Injectable()
export class RepositoryMethodsBuilder {
    private methodBuilders: {
        [verb: string]: MethodBuilder
    } = {};

    private filterModifiers: {
        [modifier: string]: FilterModifier
    } = {};

    private logger = new Logger(RepositoryMethodsBuilder.name);

    registerBuilder(builder: MethodBuilder) {
        let verb = builder.getVerb();
        if(this.methodBuilders[verb]) {
            this.throwError(`Builder for '${verb}' already exist.`)
        } else {
            this.logger.log(`Builder registered for ${verb}.`);
            this.methodBuilders[verb] = builder;
        }
    }

    registerModifier(filterModifier: FilterModifier) {
        let modifier = filterModifier.getModifier();
        if(this.filterModifiers[modifier]) {
            this.throwError(`Modifier for '${modifier}' already exist.`)
        } else {
            this.logger.log(`Modifier registered for ${modifier}.`);
            this.filterModifiers[modifier] = filterModifier;
        }
    }

    buildRepositoryMethod(methodName: string, propertiesNames: string[]): ((...args: any[]) => PromiseLike<any>) {
        const verbs = Object.keys(this.methodBuilders);
        const modifiers = Object.keys(this.filterModifiers);

        let parser = new MethodNameParser(verbs, modifiers, methodName, propertiesNames);
        let verb = parser.getVerb();

        let builder = this.methodBuilders[verb];

        if(!builder) {
            throw new Error(`MethodBuilder not found for ${verb}!`);
        }

        builder.setModifiers(this.filterModifiers);
        return builder.buildFuction(methodName, parser.getMatchedGroups());
    }

    private throwError(message: string) {
        this.logger.error(message);
        throw new Error(message);
    }
}
