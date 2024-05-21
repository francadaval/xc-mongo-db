import { Logger } from "@nestjs/common";

const funcRegex = /(findBy|findOneBy)(.)?$/g;
const complementRegex = /(?<group>(?<precedingOperator>^|And|Or)(?<attribute>.+?(?=(?<followingOperator>And|Or|$))))/g
const logger = new Logger("MethodsParser");

export function parseFunc(name: string) {
    let match = funcRegex.exec(name);
    if(!match) {
        throwError(`Function ${name}: verb doesn't match.`);
    } else {
        const verb = match[1];
        const complement = match[2];
    
        parseComplement(complement);
    }
}

function parseComplement(complement: string) {
    const matches = [...complement.matchAll(complementRegex)];
    matches.map(match => match.groups)

    
}

function throwError(message: string) {
    logger.error(message);
    throw new Error(message);
}