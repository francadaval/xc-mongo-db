import { Logger } from "@nestjs/common";
import { Operators } from "./operators";
import { Verbs } from "./verbs";

const verbs = Object.values(Verbs).join('|');
const operators = Object.values(Operators).join('|');

const funcRegex = new RegExp(`(${verbs})(.*)$`);
const complementRegex = new RegExp(`(?<group>(?<precedingOperator>^|${operators})(?<attribute>.+?(?=(?<followingOperator>${operators}|$))))`, 'g');

export type ParsedMethodGroup = {
    attribute: string,
    group: string,
    precedingOperator: string,
    followingOperator: string,
    matchedProperty?: string
}

export class MethodNameParser {

    private verb: string;
    private complement: string;
    private initialGroups: ParsedMethodGroup[];
    private compoundedGroups: ParsedMethodGroup[][];
    private firstMatchedGroups: ParsedMethodGroup[];

    private static logger = new Logger(MethodNameParser.name);

    constructor(private readonly methodName: string, private readonly properties: string[]) {
        this.parseMethodVerb();
        this.parseComplement();
        this.createCompundedGroups();
        this.matchGroupsProperties();
    }

    getVerb(): string {
        return this.verb;
    }

    getMatchedGroups() {
        return this.firstMatchedGroups;
    }

    private parseMethodVerb() {
        let match = funcRegex.exec(this.methodName);
        if(match) {
            this.verb = match[1];
            this.complement = match[2];
        } else {
            this.throwError(`Function ${this.methodName}: Not parseable, verb doesn't match.`);
        }
    }

    private parseComplement() {
        this.initialGroups = this.complement ?
            [...this.complement.matchAll(complementRegex)].map(match => match.groups as ParsedMethodGroup) :
            [];
    }

    private createCompundedGroups() {
        let complexity = Math.pow(2, this.initialGroups.length - 1);
        this.compoundedGroups = [];

        for(let i = 1; i < complexity; ++i) {
            this.compoundedGroups.push(this.compoundGroup(i));
        }
    }

    private compoundGroup(i: number): ParsedMethodGroup[] {
        let groups = [];
        let N = this.initialGroups.length;

        let newGroup = this.initialGroups[0];
        for(let e = 1; e < N; ++e) {
            if(i & e) {
                newGroup = this.mergeGroups(newGroup, this.initialGroups[e]);
            } else {
                groups.push(newGroup);
                newGroup = this.initialGroups[e];
            }
        }
        groups.push(newGroup);

        return groups;
    }

    private mergeGroups(groupA: ParsedMethodGroup, groupB: ParsedMethodGroup): ParsedMethodGroup {
        if(groupA.followingOperator !== groupB.precedingOperator) {
            this.throwError("Error on merging groups, join operators are different.")
        }

        return {
            precedingOperator: groupA.precedingOperator,
            followingOperator: groupB.followingOperator,
            attribute: groupA.attribute + groupA.followingOperator + groupB.attribute,
            group: groupA.group + groupA.followingOperator + groupB.attribute
        }
    }

    private matchGroupsProperties(): void {
        this.matchProperties(this.initialGroups);
        this.compoundedGroups.forEach( groups => this.matchProperties(groups));

        this.firstMatchedGroups = this.initialGroups.every( group => group.matchedProperty )
            ? this.initialGroups
            : this.compoundedGroups.find( groups => groups.every( group => group.matchedProperty ) );
    }

    private matchProperties(groups: ParsedMethodGroup[]): void {
        groups.forEach(group => {
            let formattedAttribute = this.firstLetterToLowerCase(group.attribute);
            group.matchedProperty = this.properties.find(property => property === formattedAttribute);
        });
    }

    private throwError(message: string) {
        MethodNameParser.logger.error(message);
        throw new Error(message);
    }

    private firstLetterToLowerCase(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}