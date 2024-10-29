import { Condition } from "mongodb";
import { ConditionArguments, FilterModifier } from "./filter-modifier";

const MATCH_ALL = "MatchAll";

export class MatchAllModifier extends FilterModifier {
    getModifier(): string {
        return MATCH_ALL;
    }

    getCondition(args: ConditionArguments): Condition<Document> {
        return { $all: args.shift() };
    }
}