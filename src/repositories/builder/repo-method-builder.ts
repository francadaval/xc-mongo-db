import { Collection } from "mongodb";
import { EntityProperties } from "../../decorators";
import { MethodNameParser, ParsedMethodGroup } from "./method-name-parser";
import { Verbs } from "./verbs";
import { Logger } from "@nestjs/common";

const logger = new Logger("RepoMethodsbuilder");

export function buildRepositoryMethod(methodName: string, entityProperties: EntityProperties) {
    const propertiesNames = Object.keys(entityProperties);
    let parser = new MethodNameParser(methodName, propertiesNames);

    switch(parser.getVerb()) {
        case Verbs.findOneBy:
            return buildFindOneByMethod(parser.getMatchedGroups(), methodName);
        case Verbs.findBy:
            return buildFindByMethod(parser.getMatchedGroups(), methodName);
        default:
            return function () {
                logger.debug(`Method "${methodName}" not parseable!!`);        
            }
    }
}

function buildFindOneByMethod(groups: ParsedMethodGroup[], methodName) {
    if(!groups || !groups.length) {
        logger.error(`${methodName}: Attributes are required on a '${Verbs.findOneBy}' method.`);
    }
    let parameters = groups.map( group => group.attribute );

    return function (...args) {
        let filter = {};
        parameters.forEach((param, i) => {
            filter[param] = args[i];
        });
        return (this.collection as Collection).findOne(filter);
    }
}

function buildFindByMethod(groups: ParsedMethodGroup[], methodName) {
    if(!groups || !groups.length) {
        logger.error(`${methodName}: Attributes are required on a '${Verbs.findOneBy}' method.`);
    }
    let parameters = groups.map( group => group.attribute );

    return function (...args) {
        this.logger.debug("Custom empty findBy method!!");
    }
}
