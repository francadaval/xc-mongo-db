import { Logger } from "@nestjs/common";

const complementRegex = new RegExp(`(?<group>(?<precedingOperator>^|And)(?<attribute>.+?(?=(?<followingOperator>And|$))))`, 'g');

export type ParsedMethodGroup = {
    attribute: string,
    group: string,
    matchedProperty?: string
}

export class MethodNameParser {

    private verb: string;
    private complement: string;
    private initialGroups: ParsedMethodGroup[];
    private compoundedGroups: ParsedMethodGroup[][];
    private firstMatchedGroups: ParsedMethodGroup[];
    private fomattedProperties: string[];

    private static logger = new Logger(MethodNameParser.name);

    constructor(private readonly verbs: string[], private readonly methodName: string, private readonly properties: string[]) {
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

    private funcRegex(verbs: string[]) {
        return new RegExp(`(${verbs.join('|')})(.*)$`);
    }

    private parseMethodVerb() {
        let match = this.funcRegex(this.verbs).exec(this.methodName);
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
        return {
            attribute: groupA.attribute + groupB.group,
            group: groupA.group + groupB.group
        }
    }

    private matchGroupsProperties(): void {
        this.fomattedProperties = this.properties.map(property => this.formatProperty(property));

        this.matchProperties(this.initialGroups);
        this.compoundedGroups.forEach( groups => this.matchProperties(groups));

        this.firstMatchedGroups = this.initialGroups.every( group => group.matchedProperty )
            ? this.initialGroups
            : this.compoundedGroups.find( groups => groups.every( group => group.matchedProperty ) );
    }

    private matchProperties(groups: ParsedMethodGroup[]): void {
        groups.forEach(group => {
            let i = this.fomattedProperties.findIndex(property => property === group.attribute);
            group.matchedProperty = i >= 0 ? this.properties[i] : null;
        });
    }

    private throwError(message: string) {
        MethodNameParser.logger.error(message);
        throw new Error(message);
    }

    private formatProperty(property: string): string {
        return property.split('.').map(part => (part.charAt(0).toUpperCase() + part.slice(1))).join('');
    }
}