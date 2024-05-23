import { parseMethodName } from "./parser";
import { Verbs } from "./verbs";

export function buildRepositoryMethod(methodName) {
    const result = parseMethodName(methodName)

    switch(result.verb) {
        case Verbs.findOneBy:
            return buildFindOneByMethod(result.complementGroups);
        case Verbs.findOne:
            return buildFindOneMethod(result.complementGroups);
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


function buildFindOneMethod(complementGroups) {
    return function () {
        this.logger.debug("Custom empty findBy method!!");
    }
}
