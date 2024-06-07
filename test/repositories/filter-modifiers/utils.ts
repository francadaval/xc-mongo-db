import { FilterModifier } from '@src/repositories/filter-modifiers';
import { Condition, Document } from 'mongodb';

export function modifierShouldReturnName(modifierUnderTest: FilterModifier): void {
    const name = modifierUnderTest.getModifier();

    expect(typeof name).toBe('string');
    expect(name).not.toBe('');
    expect(name).not.toContain(' ');
}

export function modifierShouldReturnConditionAndShiftArgsArray(
    modifierUnderTest: FilterModifier,
    condition: Condition<Document>,
    shiftedArgs: number
): void {
    const args = [1, 2, 3, 4];
    const remaining = [...args].slice(shiftedArgs);

    const actual = modifierUnderTest.getCondition(args);
    
    expect(actual).toEqual(condition);
    expect(args).toEqual(remaining);
}
