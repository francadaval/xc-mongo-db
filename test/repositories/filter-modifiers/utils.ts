import { FilterModifier } from '@src/repositories/filter-modifiers';

export function modifierShouldReturnName(modifierUnderTest: FilterModifier): void {
    const name = modifierUnderTest.getModifier();

    expect(typeof name).toBe('string');
    expect(name).not.toBe('');
    expect(name).not.toContain(' ');
}
