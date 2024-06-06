import { Document, Condition } from "mongodb";
import { FilterModifier } from "./filter-modifier";

const LESS_THAN_EQUAL = 'LessThanEqual';

export class LessThanEqualModifier extends FilterModifier {
    getModifier(): string {
        return LESS_THAN_EQUAL;
    }

    getCondition(args: any[]): Condition<Document> {
        return {'$lte': args.shift()};
    }
}
