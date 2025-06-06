import { Document, Filter } from "mongodb";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { ConditionArguments, FilterModifier } from "../filter-modifiers";
import { Logger } from "@nestjs/common";

export abstract class MethodBuilder {
    protected abstract logger: Logger;

    protected filterModifiers: {[modifier: string]: FilterModifier};

    setModifiers(filterModifiers: {[modifier: string]: FilterModifier}): void {
        this.filterModifiers = filterModifiers;
    }

    abstract getVerb(): string;

    abstract buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<unknown>

    protected getFilter(groups: ParsedMethodGroup[], args: ConditionArguments): Filter<Document> {
        const filter: Filter<Document> = {};

        groups.forEach(group => {
            const modifier = this.filterModifiers[group.modifier];
            filter[group.matchedDbProperty] = modifier ? modifier.getCondition(args) : args.shift();
        });

        return filter;
    }

    protected throwError(msg: string) {
        this.logger.error(msg);
        throw new Error(msg);
    }
}
