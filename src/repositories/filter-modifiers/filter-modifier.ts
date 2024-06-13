import { Condition, Document } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConditionArguments = any[];

export abstract class FilterModifier {
    abstract getModifier(): string;
    abstract getCondition(args: ConditionArguments): Condition<Document>;
}
