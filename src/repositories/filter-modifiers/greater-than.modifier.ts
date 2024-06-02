import { FilterModifier } from "./filter-modifier";

const GREATER_THAN = 'GreaterThan';

export class GreaterThanModifier extends FilterModifier {
    getModifier(): string {
        return GREATER_THAN;
    }
}
