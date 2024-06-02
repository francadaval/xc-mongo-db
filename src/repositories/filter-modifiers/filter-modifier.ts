import { Condition, Document, Filter } from "mongodb";

export abstract class FilterModifier {
    abstract getModifier(): string;
    abstract getCondition(args: any[]): Condition<Document>;
}
