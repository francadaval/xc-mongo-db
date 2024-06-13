import { Document, Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const GREATER_THAN = 'GreaterThan';

export class GreaterThanModifier extends FilterModifier {
    getModifier(): string {
        return GREATER_THAN;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return {'$gt': args.shift()};
    }
}
