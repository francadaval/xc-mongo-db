import { Filter } from "mongodb";
import { ParsedMethodGroup } from "../builder/method-name-parser";

export abstract class MethodBuilder {
    abstract getVerb(): string;

    abstract buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any>

    protected getFilter(groups: ParsedMethodGroup[], args: any[]): Filter<Document> {
        let parameters = groups.map( group => group.matchedProperty );
        let filter = {};
        parameters.forEach((param, i) => {
            filter[param] = args[i];
        });
        return filter;
    }
}