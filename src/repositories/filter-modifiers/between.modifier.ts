import { Document, Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const BETWEEN = 'Between';

export class BetweenModifier extends FilterModifier {
    getModifier(): string {
        return BETWEEN;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        const from = args.shift();
        const to = args.shift();
        return {$gt: from, $lt: to};
    }
}
