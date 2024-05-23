import { EntityProperties } from "../../decorators";
import { parseMethodName } from "./parser";
import { Verbs } from "./verbs";

export function buildRepositoryMethod(methodName: string, entityProperties: EntityProperties) {
    const propertiesNames = Object.keys(entityProperties);
    const result = parseMethodName(methodName, propertiesNames)

    switch(result.verb) {
        case Verbs.findOneBy:
            return buildFindOneByMethod(result.complementGroups);
        case Verbs.findBy:
            return buildFindByMethod(result.complementGroups);
        default:
            return function () {
                this.logger.debug("Method name not parseable!!");        
            }
    }
}

function buildFindOneByMethod(complementGroups) {
    return function () {
        this.logger.debug("Custom empty findByOne method!!");
    }
}

function buildFindByMethod(complementGroups) {
    return function () {
        this.logger.debug("Custom empty findBy method!!");
    }
}
