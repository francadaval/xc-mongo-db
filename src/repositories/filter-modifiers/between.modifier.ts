import { Document, Condition } from "mongodb";
import { FilterModifier } from "./filter-modifier";

const BETWEEN = 'Between';

export class BetweenModifier extends FilterModifier {
    getModifier(): string {
        return BETWEEN;
    }

    getCondition(args: any[]): Condition<Document> {
        const from = args.shift();
        const to = args.shift();
        return {'$gt': from, '$lt': to};
    }
}
