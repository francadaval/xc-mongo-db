import { Filter, Document, Condition } from "mongodb";
import { FilterModifier } from "./filter-modifier";

const GREATER_THAN = 'GreaterThan';

export class GreaterThanModifier extends FilterModifier {
    getModifier(): string {
        return GREATER_THAN;
    }

    getCondition(args: any[]): Condition<Document> {
        return {'$gt': args.shift()};
    }
}
