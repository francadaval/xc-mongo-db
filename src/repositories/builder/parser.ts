import { Logger } from "@nestjs/common";
import { Verbs } from "./verbs";
import { Operators } from "./operators";

const verbs = Object.values(Verbs).join('|');
const operators = Object.values(Operators).join('|');

const funcRegex = new RegExp(`(${verbs})(.*)$`);
const complementRegex = new RegExp(`(?<group>(?<precedingOperator>^|${operators})(?<attribute>.+?(?=(?<followingOperator>${operators}|$))))`, 'g');
const logger = new Logger("MethodsParser");

type ParsedMethodGroup = {
    attribute: string,
    group: string,
    precedingOperator: string,
    followingOperator: string,
    matchedProperty?: string
}

export function parseMethodName(name: string, properties: string[]) {
    let match = funcRegex.exec(name);
    if(match) {
        const verb = match[1];
        const complement = match[2];

        const complementGroups = parseComplement(complement, properties);
        return {
            verb,
            complementGroups
        }
    } else {
        throwError(`Function ${name}: Not parseable!`);
    }
}

function parseComplement(complement: string, properties: string[]): ParsedMethodGroup[] {
    let groups: ParsedMethodGroup[] = complement ?
        [...complement.matchAll(complementRegex)].map(match => match.groups as ParsedMethodGroup) :
        [];
    
    groups.forEach(group => {
        let formattedAttribute = firstLetterToLowerCase(group.attribute);
        group.matchedProperty = properties.find(property => property === formattedAttribute);
    });

    let updated = true;
    while (updated && groups.find(group => !group.matchedProperty)) {
        updated = false;

        let firstUnmatchIndex = groups.findIndex(group => !group.matchedProperty);

        let prevLength = groups.length;
        groups = findMatchForGroup(firstUnmatchIndex, groups, properties);
        updated = prevLength !== groups.length;
    }

    return groups;
}

function findMatchForGroup(i: number, groups: ParsedMethodGroup[], properties: string[]) {
    let j, k;
    let matchedProperty = null;
    
    for (j = i; j >= 0; --j) {
        for (k = i; k < groups.length; ++k) {
            if (j != k) {
                let composed = composedAttribute(j, k, groups);
                let formattedComposed = firstLetterToLowerCase(composed);
                matchedProperty = properties.find(property => property === formattedComposed);

                if (matchedProperty) {
                    break;
                }
            }
        }
        if (matchedProperty) {
            break;
        }
    }

    if(matchedProperty) {
        return mergeGroups(j, k, groups, matchedProperty);
    }

    return groups;
}

function mergeGroups(j: number, k: number, groups: ParsedMethodGroup[], matchedProperty: string): ParsedMethodGroup[] {
    let mergedGroup: ParsedMethodGroup = {
        precedingOperator: groups[j].precedingOperator,
        followingOperator: groups[k].followingOperator,
        attribute: groups[j].attribute,
        group: groups[j].group,
        matchedProperty
    }

    for(let i = j+1; i <= k; ++i) {
        let added = groups[i].precedingOperator + groups[i].attribute;
        mergedGroup.attribute += added;
        mergedGroup.group += added;
    }

    groups.splice(j, k-j+1, mergedGroup);
    
    return groups;
}

function composedAttribute(start: number, end: number, groups: ParsedMethodGroup[]): string {
    let att = '';
    groups.slice(start, end+1).forEach( (group, i) => {
        att = att.concat( i ? group.precedingOperator : '').concat( group.attribute );
    });
    return att;
}

function throwError(message: string) {
    logger.error(message);
    throw new Error(message);
}

function firstLetterToLowerCase(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
