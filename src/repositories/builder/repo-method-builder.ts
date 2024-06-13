import { MethodNameParser } from "./method-name-parser";
import { MethodBuilder } from "../method-builders/method-builder";
import { FilterModifier } from "../filter-modifiers";

import { Injectable, Logger } from "@nestjs/common";

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
        const verb = builder.getVerb();
        if(this.methodBuilders[verb]) {
            this.throwError(`Builder for '${verb}' already exist.`)
        } else {
            this.logger.log(`Builder registered for ${verb}.`);
            this.methodBuilders[verb] = builder;
        }
    }

    registerModifier(filterModifier: FilterModifier) {
        const modifier = filterModifier.getModifier();
        if(this.filterModifiers[modifier]) {
            this.throwError(`Modifier for '${modifier}' already exist.`)
        } else {
            this.logger.log(`Modifier registered for ${modifier}.`);
            this.filterModifiers[modifier] = filterModifier;
        }
    }

    buildRepositoryMethod(methodName: string, propertiesNames: string[], dbPropertiesNames: string[]): ((...args: any[]) => PromiseLike<unknown>) {
        const verbs = Object.keys(this.methodBuilders);
        const modifiers = Object.keys(this.filterModifiers);

        const parser = new MethodNameParser(verbs, modifiers);
        parser.parse(methodName, propertiesNames, dbPropertiesNames);

        const builder = this.methodBuilders[parser.getVerb()];

        builder.setModifiers(this.filterModifiers);
        return builder.buildMethod(methodName, parser.getMatchedGroups());
    }

    private throwError(message: string) {
        this.logger.error(message);
        throw new Error(message);
    }
}
