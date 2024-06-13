import { Document, Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const LESS_THAN = 'LessThan';

export class LessThanModifier extends FilterModifier {
    getModifier(): string {
        return LESS_THAN;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return {'$lt': args.shift()};
    }
}
