import { Logger } from "@nestjs/common";
import { Verbs } from "./verbs";
import { Operators } from "./operators";

const verbs = Object.values(Verbs).join('|');
const operators = Object.values(Operators).join('|');

const funcRegex = new RegExp(`(${verbs})(.*)$`);
const complementRegex = new RegExp(`(?<group>(?<precedingOperator>^|${operators})(?<attribute>.+?(?=(?<followingOperator>${operators}|$))))`, 'g');
const logger = new Logger("MethodsParser");

export function parseMethodName(name: string) {
    let match = funcRegex.exec(name);
    if(match) {
        const verb = match[1];
        const complement = match[2];

        const complementGroups = parseComplement(complement);
        return {
            verb,
            complementGroups
        }
    } else {
        throwError(`Function ${name}: Not parseable!`);
    }
}

function parseComplement(complement: string) {
    return complement ? [...complement.matchAll(complementRegex)].map(match => match.groups) : [];
}

function throwError(message: string) {
    logger.error(message);
    throw new Error(message);
}