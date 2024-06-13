import { Document, Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const GREATER_THAN_EQUAL = 'GreaterThanEqual';

export class GreaterThanEqualModifier extends FilterModifier {
    getModifier(): string {
        return GREATER_THAN_EQUAL;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return {'$gte': args.shift()};
    }
}
