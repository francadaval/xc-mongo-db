import { Document, Condition } from "mongodb";
import { FilterModifier } from "./filter-modifier";

const LESS_THAN = 'LessThan';

export class LessThanModifier extends FilterModifier {
    getModifier(): string {
        return LESS_THAN;
    }

    getCondition(args: any[]): Condition<Document> {
        return {'$lt': args.shift()};
    }
}
