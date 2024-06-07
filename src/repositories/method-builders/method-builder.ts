import { Document, Filter } from "mongodb";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { FilterModifier } from "../filter-modifiers";
import { Logger } from "@nestjs/common";

export abstract class MethodBuilder {
    protected abstract logger: Logger;

    protected filterModifiers: {[modifier: string]: FilterModifier};

    setModifiers(filterModifiers: {[modifier: string]: FilterModifier}): void {
        this.filterModifiers = filterModifiers;
    }

    abstract getVerb(): string;

    abstract buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any>

    protected getFilter(groups: ParsedMethodGroup[], args: any[]): Filter<Document> {
        let filter: Filter<Document> = {};
        args = [...args];

        groups.forEach(group => {
            const modifier = this.filterModifiers[group.modifier];
            filter[group.matchedProperty] = modifier ? modifier.getCondition(args) : args.shift();
        });

        return filter;
    }

    protected throwError(msg: string) {
        this.logger.error(msg);
        throw new Error(msg);
    }
}
