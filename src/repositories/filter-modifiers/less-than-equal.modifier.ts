import { Document, Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const LESS_THAN_EQUAL = 'LessThanEqual';

export class LessThanEqualModifier extends FilterModifier {
    getModifier(): string {
        return LESS_THAN_EQUAL;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return {'$lte': args.shift()};
    }
}
