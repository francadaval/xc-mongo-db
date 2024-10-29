import { Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const IN = "In";

export class InModifier extends FilterModifier {
    getModifier(): string {
        return IN;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return { $in: args.shift() };
    }
}
