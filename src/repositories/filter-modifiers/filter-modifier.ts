import { Condition, Document } from "mongodb";

export abstract class FilterModifier {
    abstract getModifier(): string;
    abstract getCondition(args: any[]): Condition<Document>;
}
