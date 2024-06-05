import { Logger } from "@nestjs/common";

const complementRegex = new RegExp(`(?<group>(?<precedingOperator>^|And)(?<attribute>.+?(?=(?<followingOperator>And|$))))`, 'g');

export type ParsedMethodGroup = {
    attribute: string,
    modifier?: string,
    group: string,
    matchedProperty?: string
}

export type ModifierGroup = {
    attribute: string,
    modifier: string,
    index?: number
}

export class MethodNameParser {

    private methodName: string;
    private properties: string[]

    private verb: string;
    private complement: string;
    private initialGroups: ParsedMethodGroup[];
    private compoundedGroups: ParsedMethodGroup[][];
    private firstMatchedGroups: ParsedMethodGroup[];
    private fomattedProperties: string[];

    private static logger = new Logger(MethodNameParser.name);

    constructor(private readonly verbs: string[], private readonly modifiers: string[]) {}

    parse(methodName: string, properties: string[]) {
        this.methodName = methodName;
        this.properties = properties;

        this.reset();
        this.parseMethodVerb();
        this.parseComplement();
        this.createCompundedGroups();
        this.splitModifiers();
        this.matchGroupsProperties();
    }

    getVerb(): string {
        return this.verb;
    }

    getMatchedGroups() {
        return this.firstMatchedGroups;
    }

    private reset() {
        this.verb = null;
        this.complement = null;
        this.initialGroups = null;
        this.compoundedGroups = null;
        this.firstMatchedGroups = null;
        this.fomattedProperties = null;
    }

    private funcRegex() {
        return new RegExp(`(${this.verbs.join('|')})(.*)$`);
    }

    private modifiersRegex() {
        return new RegExp(`(?<attribute>.*)(?<modifier>${this.modifiers.join('|')})$`)
    }

    private parseMethodVerb() {
        let match = this.funcRegex().exec(this.methodName);
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

    private splitModifiers() {
        const withModifiers = this.splitGroupsMofiers(this.initialGroups);

        this.compoundedGroups.forEach(groups => {
            withModifiers.push(...this.splitGroupsMofiers(groups));
        });

        this.compoundedGroups.push(...withModifiers);
    }

    private splitGroupsMofiers(groups: ParsedMethodGroup[]): ParsedMethodGroup[][] {
        const splitted: ParsedMethodGroup[][] = [];
        const modifiersGroups: ModifierGroup[] = [];

        groups.forEach((group, i) => {
            let modifierGroups = this.getModifier(group.attribute);
            if(modifierGroups) {
                modifierGroups.index = i;
                modifiersGroups.push(modifierGroups);
            }
        });

        modifiersGroups.forEach(modifierGroups => {
            let toPush: ParsedMethodGroup[][] = [];
            toPush.push(this.splitGroupsModifier(groups, modifierGroups));
            splitted.forEach(spGroups => {
                toPush.push(this.splitGroupsModifier(spGroups, modifierGroups));
            })

            splitted.push(...toPush);
        })

        return splitted;
    }

    private splitGroupsModifier(groups: ParsedMethodGroup[], modifier: ModifierGroup): ParsedMethodGroup[] {
        let splitted = [...groups];
        let original = groups[modifier.index];
        splitted[modifier.index] = {
            attribute: modifier.attribute,
            group: original.group,
            modifier: modifier.modifier
        }
        return splitted;
    }

    private getModifier(attribute: string): ModifierGroup {
        const result = this.modifiersRegex().exec(attribute);
        return result ? {
            attribute: result.groups.attribute,
            modifier: result.groups.modifier
        } : null;
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