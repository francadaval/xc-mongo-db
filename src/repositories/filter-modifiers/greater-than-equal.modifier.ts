import { Document, Condition } from "mongodb";
import { FilterModifier } from "./filter-modifier";

const GREATER_THAN_EQUAL = 'GreaterThanEqual';

export class GreaterThanEqualModifier extends FilterModifier {
    getModifier(): string {
        return GREATER_THAN_EQUAL;
    }

    getCondition(args: any[]): Condition<Document> {
        return {'$gte': args.shift()};
    }
}
